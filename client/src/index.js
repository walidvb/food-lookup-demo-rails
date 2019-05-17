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