import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import promiseMiddleware from 'redux-promise';
import { createStore, applyMiddleware } from 'redux';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import App from './App';
import store from './store';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render((
    <Provider store={store}>
      <App />
    </Provider>
  ),
  document.getElementById('root')
);

registerServiceWorker();
