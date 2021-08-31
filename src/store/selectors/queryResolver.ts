import { RootState } from '../rootState';

export const selectCache = (state: RootState) => state.queryResolver.cache;
