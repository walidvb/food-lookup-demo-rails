var version = "v1::";

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
          return res;})
        .catch(function (error) {
          console.log("Error POSTing: ", error);
          var resBody = JSON.stringify({ description: 'unsynced'})
          return new Response(resBody, {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            }
          })
        })
    )
  };
})
