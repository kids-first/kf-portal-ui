/**
 * @src https://redux.js.org/usage/writing-tests#connected-components
 */
import React, { PropsWithChildren } from 'react';
import intl from 'react-intl-universal';
import { Provider } from 'react-redux';
// import ApolloProvider from 'provider/ApolloProvider';
import { MockedProvider } from '@apollo/client/testing';
import Empty from '@ferlab/ui/core/components/Empty';
import type { PreloadedState } from '@reduxjs/toolkit';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import locales from 'locales';

import { LANG } from 'common/constants';
import { FenceCavaticaState } from 'store/fenceCavatica';
import { FenceConnectionState } from 'store/fenceConnection';
import { FenceStudiesState } from 'store/fenceStudies';
import { GlobalState } from 'store/global/slice';
import type { AppStore } from 'store/index';
import { store as setupStore } from 'store/index';
import { NotebookState } from 'store/notebook/slice';
import { PersonaState } from 'store/persona';
import { RemoteState } from 'store/remote';
import { ReportState } from 'store/report';
import { SavedFilterState } from 'store/savedFilter';
import { SavedSetState } from 'store/savedSet';
import type { RootState } from 'store/types';
import { UserState } from 'store/user';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}

export const defaultPreloadedState = {
  global: GlobalState,
  user: UserState,
  persona: PersonaState,
  notebook: NotebookState,
  report: ReportState,
  fenceConnection: FenceConnectionState,
  fenceStudies: FenceStudiesState,
  savedFilter: SavedFilterState,
  savedSet: SavedSetState,
  fenceCavatica: FenceCavaticaState,
  remote: RemoteState,
};

export function renderWithProviders(
  ui: React.ReactElement,
  { store = setupStore, ...renderOptions }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    intl.init({ locales, currentLocale: LANG.EN, warningHandler: () => '' });

    return (
      <Provider store={store}>
        <ConfigProvider locale={enUS} renderEmpty={() => <Empty imageType="grid" />}>
          <MockedProvider>{children}</MockedProvider>
        </ConfigProvider>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
