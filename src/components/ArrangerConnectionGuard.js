import React from 'react';
import Component from 'react-component-component';

import { initializeApi } from 'services/api';
import graphql from 'services/arranger';

// eslint-disable-next-line react/display-name
export default ({ graphqlField, render }) => (
  <Component
    initialState={{ connecting: true, connectionError: false }}
    didMount={({ setState }) =>
      graphql(initializeApi())({ query: `query { ${graphqlField} { mapping } }` }).then((x) =>
        setState({ connecting: false, connectionError: !x }),
      )
    }
  >
    {({ state: { connecting, connectionError } }) => render({ connecting, connectionError })}
  </Component>
);
