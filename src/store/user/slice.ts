import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from 'store/user/types';
import keycloak from 'auth/keycloak-api/keycloak';
import { deleteUser, fetchUser, updateUser, updateUserConfig } from 'store/user/thunks';
import { STATIC_ROUTES } from 'utils/routes';

export const UserState: initialState = {
  userInfo: null,
  isLoading: true,
  isUpdating: false,
  isDeleting: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState: UserState,
  reducers: {
    cleanLogout: (state) => {
      keycloak.logout({
        redirectUri: `${window.location.origin}/${STATIC_ROUTES.LOGIN}`,
      });

      return UserState;
    },
    setIsUserLoading: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isLoading: action.payload,
    }),
  },
  extraReducers: (builder) => {
    // Fetch User
    builder.addCase(fetchUser.pending, (state) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => ({
      ...state,
      userInfo: action.payload,
      isLoading: false,
    }));
    builder.addCase(fetchUser.rejected, (state, action) => ({
      ...state,
      error: action.payload,
      isLoading: false,
    }));
    // Update User
    builder.addCase(updateUser.pending, (state) => {
      state.isUpdating = true;
      state.error = undefined;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => ({
      ...state,
      userInfo: action.payload,
      isUpdating: false,
    }));
    builder.addCase(updateUser.rejected, (state, action) => ({
      ...state,
      error: action.payload,
      isUpdating: false,
    }));
    // Update User Config
    builder.addCase(updateUserConfig.fulfilled, (state, action) => ({
      ...state,
      userInfo: {
        ...state.userInfo!,
        config: action.payload,
      },
    }));
    builder.addCase(updateUserConfig.rejected, (state, action) => ({
      ...state,
      error: action.payload,
    }));

    // Delete User
    builder.addCase(deleteUser.pending, (state) => {
      state.isDeleting = true;
    });
    builder.addCase(deleteUser.fulfilled, (state) => {
      state.isDeleting = false;
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.isDeleting = false;
      state.error = action.payload;
    });
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
