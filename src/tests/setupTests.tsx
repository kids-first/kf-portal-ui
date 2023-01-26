/**
 * @src https://redux.js.org/usage/writing-tests#connected-components
 */
import React, { PropsWithChildren } from 'react';
import intl from 'react-intl-universal';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import type { PreloadedState } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import enUS from 'antd/lib/locale/en_US';
import frFR from 'antd/lib/locale/fr_FR';
import Empty from '@ferlab/ui/core/components/Empty';

import type { RootState } from 'store/types';
import type { AppStore } from 'store/index';
import { store as setupStore } from 'store/index';

import { GlobalState } from 'store/global/slice';
import { FenceCavaticaState } from 'store/fenceCavatica';
import { FenceConnectionState } from 'store/fenceConnection';
import { FenceStudiesState } from 'store/fenceStudies';
import { NotebookState } from 'store/notebook/slice';
import { PersonaState } from 'store/persona';
import { ReportState } from 'store/report';
import { SavedFilterState } from 'store/savedFilter';
import { SavedSetState } from 'store/savedSet';
import { UserState } from 'store/user';
import { RemoteState } from 'store/remote';
import { ConfigProvider } from 'antd';
// import ApolloProvider from 'provider/ApolloProvider';
import { MockedProvider } from "@apollo/client/testing";

import { GraphqlBackend } from 'provider/types';

const locales = {
  'en-US': enUS,
  'fr-FR': frFR,
};

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {
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
    },
    store = setupStore,
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    intl.init({ locales, currentLocale: 'en-US' });

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
