import { createSlice } from '@reduxjs/toolkit';
import { INDEXES } from 'graphql/constants';

import { fetchVennData } from './thunks';
import { initialState } from './types';

export const VennState: initialState = {
  index: INDEXES.PARTICIPANT,
  summary: [],
  operations: [],
  loading: false,
  error: false,
};

const vennSlice = createSlice({
  name: 'venn',
  initialState: VennState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchVennData.pending, (state) => {
      state.loading = true;
      state.error = false;
    });
    builder.addCase(fetchVennData.fulfilled, (state, action) => {
      state.loading = false;
      state.summary = action.payload.summary;
      state.operations = action.payload.operations;
      state.index = action.payload.index;
    });
    builder.addCase(fetchVennData.rejected, (state) => {
      state.loading = false;
      state.error = true;
    });
  },
});

export const vennActions = vennSlice.actions;
export default vennSlice.reducer;
