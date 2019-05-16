var version = "v1::";

self.addEventListener('install', function(event){
  console.log('WORKER: install event in progress.');
  event.waitUntil(
    caches
      .open(version + 'gri')
      .then(function(cache){
        return cache.addAll([
          '/',
          '/static/js/bundle.js'
        ])
      })
      .then(function(){
        console.log('WORKER: install completed')
      })
  )
});

self.addEventListener('fetch', function(event){
  if(event.request.method !== 'GET'){
    return
  }

  event.respondWith(new Promise(function(resolve, reject){
    var response = new Response('yessss', {
      status: 200,
      headers: new Headers({
        'Content-Type': 'text/html',
      })
    })
    resolve(response)
  }))
})