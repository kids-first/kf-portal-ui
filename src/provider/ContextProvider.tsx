import intl from 'react-intl-universal';
import { Provider as ReduxProvider } from 'react-redux';
import locales from 'locales';
import KeycloakProvider from 'provider/KeycloakProvider';
import { PersistGate } from 'redux-persist/integration/react';

import { LANG } from 'common/constants';
import getStoreConfig from 'store';

const { store, persistor } = getStoreConfig();
persistor.subscribe(function () {
  intl.init({
    currentLocale: store.getState().global.lang || LANG.EN,
    locales,
    warningHandler: () => '',
  });
});

const ContextProvider = ({ children }: any) => (
  <KeycloakProvider>
    <ReduxProvider store={store}>
      <PersistGate persistor={persistor}>{children}</PersistGate>
    </ReduxProvider>
  </KeycloakProvider>
);

export default ContextProvider;
