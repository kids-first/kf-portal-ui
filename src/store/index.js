import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';

import rootReducer from './reducers';
import subscribe from './subscribers';

let store = null;
export const initStore = preloadedState => {
  const composeEnhancers = composeWithDevTools({
    // Specify extension’s options like name,
    //  actionsBlacklist, actionsCreators, serialize...
  });

  const enhancer = composeEnhancers(
    applyMiddleware(thunk),
    // other store enhancers if any
  );

  const store = createStore(rootReducer, preloadedState, enhancer);

  // Hooks the subscribers to the store
  subscribe(store);

  return store;
};

export default store;
