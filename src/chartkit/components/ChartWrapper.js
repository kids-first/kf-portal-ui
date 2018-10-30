import React from 'react';
import Component from 'react-component-component';

import LoadingSpinner from 'uikit/LoadingSpinner';

const ChartWrapper = ({ api, getData, children }) => (
  <Component
    style={{ height: '100%' }}
    initialState={{ data: null, isLoading: true }}
    didMount={({ setState }) => {
      getData(api)
        .then(res => res.json())
        .then(data => setState({ data: data, isLoading: false }))
        .catch(err => console.log('err', err));
    }}
  >
    {({ state }) =>
      state.isLoading ? (
        <LoadingSpinner size="50px" />
      ) : state.data ? (
        React.cloneElement(children, { data: state.data })
      ) : (
        <div>no data :(</div>
      )
    }
  </Component>
);

export default ChartWrapper;
