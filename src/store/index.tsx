import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import logger from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import EnvVariables from 'helpers/EnvVariables';
import { RootState } from 'store/types';
import createFilter from 'redux-persist-transform-filter';
// Reducers
import GlobalReducer from 'store/global';
import UserReducer from 'store/user';
import FenceConnectionReducer from 'store/fenceConnection';
import ReportReducer from 'store/report';
import SavedFilterReducer from 'store/savedFilter';
import SavedSetReducer from 'store/savedSet';
import FenceCavaticaReducer from 'store/fenceCavatica';
import FenceStudiesReducer from 'store/fenceStudies';

const devMode = EnvVariables.configFor('ENV') === 'development';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['global'],
  transforms: [createFilter('global', ['lang'])],
};

const rootReducer = combineReducers<RootState>({
  global: GlobalReducer,
  user: UserReducer,
  report: ReportReducer,
  fenceConnection: FenceConnectionReducer,
  fenceStudies: FenceStudiesReducer,
  savedFilter: SavedFilterReducer,
  savedSet: SavedSetReducer,
  fenceCavatica: FenceCavaticaReducer,
});

const store: any = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  devTools: devMode,
  middleware: (getDefaultMiddleware) => {
    let defaultMid = getDefaultMiddleware({
      serializableCheck: false,
    });
    return devMode ? defaultMid.concat(logger) : defaultMid;
  },
});

const persistor = persistStore(store);

export default function getStoreConfig() {
  return { store, persistor };
}
