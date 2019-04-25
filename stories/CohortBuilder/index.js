import React from 'react';
import { storiesOf } from '@storybook/react';
import CohortBuilder from 'components/CohortBuilder';

import { ThemeProvider } from 'emotion-theming';
import { AppContainer } from 'react-hot-loader';
import theme from 'theme/defaultTheme';
import { initializeApi, ApiContext } from 'services/api';

/**
 * TODO: move this out of this file
 */
const EnvironmentContainer = ({ children }) => (
  <ApiContext.Provider
    value={initializeApi({
      defaultHeaders: {
        authorization: `Bearer ${localStorage.EGO_JWT}`,
      },
      onUnauthorized: response => {
        console.log('[unauthorized]: please put your ego token in the Login story ');
      },
    })}
  >
    <ThemeProvider theme={theme}>
      <AppContainer>{children}</AppContainer>
    </ThemeProvider>
  </ApiContext.Provider>
);

storiesOf('CohortBuilder', module)
  .add('Page Layout', () => (
    <EnvironmentContainer>
      <CohortBuilder />
    </EnvironmentContainer>
  ))
  .add('Menu Bar', () => {
    return <div>Add menu bar component here</div>;
  })
  .add('Checkbox Filters UI', () => {
    return <div>add checkbox filters UI here</div>;
  })
  .add('Continuous filters UI', () => {
    return <div>add Continuous filters UI here</div>;
  })
  .add('Boolean Filters UI', () => {
    return <div>add Boolean Filters UI here</div>;
  })
  .add('Phenotypes tree', () => {
    return <div>add phenotypes tree component here</div>;
  })
  .add('Sqon Builder Integration', () => {
    return <div>add Sqon Builder Integration here</div>;
  });
