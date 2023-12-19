import { configureStore } from '@reduxjs/toolkit';
import EnvVariables from 'helpers/EnvVariables';
import { combineReducers } from 'redux';
import logger from 'redux-logger';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createFilter from 'redux-persist-transform-filter';

import FenceCavaticaReducer from 'store/fenceCavatica';
import FenceConnectionReducer from 'store/fenceConnection';
import FencesReducer from 'store/fences';
import FenceStudiesReducer from 'store/fenceStudies';
import GlobalReducer from 'store/global';
import NotebookReducer from 'store/notebook';
import PersonaReducer from 'store/persona';
import RemoteReducer from 'store/remote';
import ReportReducer from 'store/report';
import SavedFilterReducer from 'store/savedFilter';
import SavedSetReducer from 'store/savedSet';
import { RootState } from 'store/types';
import UserReducer from 'store/user';

const devMode = EnvVariables.configFor('ENV') === 'development';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['global'],
  transforms: [createFilter('global', ['lang'])],
};

export const rootReducer = combineReducers<RootState>({
  global: GlobalReducer,
  fences: FencesReducer,
  persona: PersonaReducer,
  notebook: NotebookReducer,
  user: UserReducer,
  report: ReportReducer,
  fenceConnection: FenceConnectionReducer,
  fenceStudies: FenceStudiesReducer,
  savedFilter: SavedFilterReducer,
  savedSet: SavedSetReducer,
  fenceCavatica: FenceCavaticaReducer,
  remote: RemoteReducer,
});

export const store: any = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  devTools: devMode,
  middleware: (getDefaultMiddleware) => {
    const defaultMid = getDefaultMiddleware({
      serializableCheck: false,
    });
    return devMode ? defaultMid.concat(logger) : defaultMid;
  },
});

const persistor = persistStore(store);

export default function getStoreConfig() {
  return { store, persistor };
}

export type AppStore = ReturnType<typeof store>;
export type AppDispatch = AppStore['dispatch'];
