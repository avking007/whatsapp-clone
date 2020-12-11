import rootreducer from './reducers/root';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

const middleware = [thunk];

const initState = {};
const store = createStore(
  rootreducer,
  initState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
