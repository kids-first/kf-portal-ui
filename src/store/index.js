import { configureStore } from '@reduxjs/toolkit';

import { devDebug } from 'common/injectGlobals';

import rootReducer from './reducers';
import subscribe from './subscribers';

export { default as getPreloadedState } from './statePreloader';

export let store = null;
export const initStore = (preloadedState = {}) => {
  store = configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState,
    devTools: devDebug,
  });

  // Hooks the subscribers to the store
  subscribe(store);

  return store;
};
