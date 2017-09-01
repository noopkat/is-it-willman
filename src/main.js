import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';

import reducer from './reducers';
import  App from './components/containers/app';
import rootSaga from './sagas';

const saga = createSagaMiddleware();
const middleware = [saga];

const store = createStore(
  reducer,
  applyMiddleware(...middleware)
)

saga.run(rootSaga);
store.dispatch({ type: 'GET_MEDIA_REQUESTED' });

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
