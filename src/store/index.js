import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';

import rootReducer from './reducers';
import subscribe from './subscribers';

export { default as getPreloadedState } from './statePreloader';

export let store = null;
export const initStore = (preloadedState = {}) => {
  const composeEnhancers = composeWithDevTools({
    // Specify extension’s options like name,
    //  actionsBlacklist, actionsCreators, serialize...
  });

  const enhancer = composeEnhancers(
    applyMiddleware(thunk),
    // other store enhancers if any
  );

  store = createStore(rootReducer, preloadedState, enhancer);

  // Hooks the subscribers to the store
  subscribe(store);

  return store;
};
