import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers';
import subscribe from './subscribers';

export { default as getPreloadedState } from './statePreloader';

export let store = null;
export const initStore = (preloadedState = {}) => {
  const composeEnhancers =
    (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

  const enhancer = composeEnhancers(applyMiddleware(thunk));

  store = createStore(rootReducer, preloadedState, enhancer);

  // Hooks the subscribers to the store
  subscribe(store);

  return store;
};
