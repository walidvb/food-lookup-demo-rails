navigator.serviceWorker.ready.then(function(registration){
  console.log('BS: Service Worker Ready')
  return registration.sync.register('sendFormData')
})
  .then(function () {
    console.log('sync event registered')
  }).catch(function () {
    // system was unable to register for a sync,
    // this could be an OS-level restriction
    console.log('sync registration failed')
  });