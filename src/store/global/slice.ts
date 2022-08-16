import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState, MessageArgsPropsCustom } from 'store/global/types';
import { LANG } from 'common/constants';
import intl from 'react-intl-universal';
import locales from 'locales';
import { ArgsProps as NotificationArgsProps } from 'antd/lib/notification';
import { fetchStats } from './thunks';

export const GlobalState: initialState = {
  lang: LANG.EN,
  notification: undefined,
  message: undefined,
  messagesToDestroy: [],
  stats: undefined,
  isFetchingStats: false,
};

const globalSlice = createSlice({
  name: 'global',
  initialState: GlobalState,
  reducers: {
    changeLang: (state, action: PayloadAction<LANG>) => {
      intl.init({
        currentLocale: action.payload,
        locales,
      });

      return {
        ...state,
        lang: action.payload,
      };
    },

    displayMessage: (state, action: PayloadAction<MessageArgsPropsCustom>) => ({
      ...state,
      message: action.payload,
    }),

    destroyMessages: (state, action: PayloadAction<string[]>) => ({
      ...state,
      message: undefined,
      messagesToDestroy: action.payload,
    }),

    displayNotification: (state, action: PayloadAction<NotificationArgsProps>) => ({
      ...state,
      notification: action.payload,
    }),

    destroyNotification: (state) => ({
      ...state,
      notification: undefined,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStats.pending, (state) => {
      state.isFetchingStats = true;
    });
    builder.addCase(fetchStats.fulfilled, (state, action) => {
      state.isFetchingStats = false;
      state.stats = action.payload;
    });
    builder.addCase(fetchStats.rejected, (state) => {
      state.isFetchingStats = false;
    });
  },
});

export const globalActions = globalSlice.actions;
export default globalSlice.reducer;
