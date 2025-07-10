import { createSlice } from '@reduxjs/toolkit';

import { fetchCommunityUsers } from 'store/community/thunks';
import { initialState } from 'store/community/types';

export const CommunityState: initialState = {
  users: [],
  total: 0,
  allActiveUsersTotal: 0,
  loading: false,
};

const communitySlice = createSlice({
  name: 'community',
  initialState: CommunityState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Community Users
    builder.addCase(fetchCommunityUsers.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(fetchCommunityUsers.fulfilled, (state, action) => ({
      ...state,
      users: action.payload.users,
      total: action.payload.total,
      allActiveUsersTotal: action.payload.allActiveUsersTotal,
      loading: false,
    }));
    builder.addCase(fetchCommunityUsers.rejected, (state) => ({
      ...state,
      error: true,
      loading: false,
    }));
  },
});

export const communityActions = communitySlice.actions;
export default communitySlice.reducer;
