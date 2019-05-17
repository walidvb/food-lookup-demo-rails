var version = "v1::";
var DB = new Database();

self.addEventListener('install', function(event){
  console.log('WORKER: install event in progress.');
  event.waitUntil(
    caches
      .open(version + 'fundamentals')
      .then(function(cache){
        return cache.addAll([
          '/',
          '/static/js/bundle.js',
          '/api/food'
        ])
      })
      .then(function(){
        console.log('WORKER: install completed')
      })
  )
});

self.addEventListener('fetch', function(event){
  const byPassSWUrls = /sockjs/
  if(event.request.method === 'POST'){
    handlePOSTRequest(event);
    return
  }
  if(event.request.method !== 'GET' || byPassSWUrls.test(event.request.url)){
    return
  }

  if(/_sw\/sync$/.test(event.request.url)){
    handleSync(event);
    return;
  }
  event.respondWith(
    caches
    .match(event.request)
    .then(function(cached){
      var networked = fetch(event.request)
        .then(fetchedFromNetwork, unableToResolve)
        .catch(unableToResolve);

        return cached || networked;

        function fetchedFromNetwork(response){
          var cacheCopy = response.clone();
          console.log('WORKER: fetch response', event.request.url);

          caches
            .open(version+'pages')
            .then(function add(cache){
              cache.put(event.request, cacheCopy)
            })
            .then(function(){
              console.log('WORKER: fetch stored in cache', event.request.url);
            })
        }

        function unableToResolve(){
          var emptyRes = JSON.stringify([{ description: "No cached response for this", kcal: 717, fat_g: 75.43, carbohydrate_g: 0.06, protein_g: 0.85 }])
          return new Response(emptyRes, {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            }
          })
        }
    })
  );

  function handlePOSTRequest(event) {
    console.log("Handling POST", event.request.url);

    event.respondWith(
      fetch(event.request.clone())
        .then(function(res){
          console.log('successful POST');
          return res;
        })
        .catch(function (error) {
          console.log("Error POSTing: ", error);
          var resBody = JSON.stringify({ description: 'unsynced'})
          savePOSTForLater(event.request.clone());
          return new Response(resBody, {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            }
          })
        })
    )
  };
});

function handleSync(event){
  sendLocalPostRequests();
  event.respondWith(
    new Response(JSON.stringify({ success: 1 }))
  );
}
function sendLocalPostRequests(){
  console.log('sendLocalPostRequests')
  DB.get(function(requests){
    requests.forEach(sendRequest);
    function sendRequest(elem){
      console.log('Retrying', elem)
      fetch(elem.url, {
        body: JSON.stringify(elem.payload),
        method: elem.method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
        .then(function(){
          DB.delete(elem.id)
        })
        .catch(function(){
          console.log("Still couldn't POST", elem);
        });
    }
  })
};

// =========================== DB


function savePOSTForLater(request){
  console.log('Saving request');
  request.json().then(function(payload){
    DB.add({
      url: request.url, 
      payload: payload, 
      method: request.method,
    });
  })
};




function Database(){
  var db;
  var dbName = 'GRI';
  var storeName = 'post_requests';
  function openDatabase() {
    var indexedDBOpenRequest = indexedDB.open(dbName, 1)
    indexedDBOpenRequest.onerror = function (error) {
      console.error('IndexedDB error:', error)
      // handle db error!!
    }
    indexedDBOpenRequest.onupgradeneeded = function () {
      this.result.createObjectStore(storeName, {
        autoIncrement: true, keyPath: 'id'
      });
    }
    indexedDBOpenRequest.onsuccess = function () {
      db = this.result;
      sendLocalPostRequests();
    }
  }

  function getObjectStore(storeName, mode) {
    return db.transaction(storeName, mode).objectStore(storeName);
  }

  openDatabase();
  return {
    get(callback){
      var dbRequest = getObjectStore(storeName, 'readwrite').openCursor();
      var rows = []
      dbRequest.onsuccess = function(event){
        var cursor = event.target.result;
        if(cursor){
          rows.push(cursor.value)
          cursor.continue();
        }
        else{
          callback(rows);
        }
      }
    },
    add(row){
      var dbRequest = getObjectStore(storeName, 'readwrite').add(row)
      dbRequest.onsuccess = function(event){
        console.log('saved in indexed')
      }
      dbRequest.onerror = function (event) {
        console.log('error saving to indexed')
      }
    },
    delete(id){
      getObjectStore(storeName, 'readwrite').delete(id);
    }
  }
}