import React from 'react';
import ReactDOM from 'react-dom';
require('./backgroundSync.js');
import App from './App';
import './index.css';
import '../semantic/dist/semantic.min.css';

ReactDOM.render(
  <App />,
  document.getElementById('root'), // eslint-disable-line no-undef
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').then(function (registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function (err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });

}