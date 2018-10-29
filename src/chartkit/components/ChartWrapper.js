import React from 'react';
import Component from 'react-component-component';

const ChartWrapper = ({ endpoint = '', children }) => (
  <Component
    initialState={{ data: null, isLoading: true }}
    didMount={({ setState }) => {
      fetch('http://localhost:3000/barChart')
        .then(res => res.json())
        .then(data => setTimeout(() => setState({ data: data, isLoading: false }), 2000))
        .catch(err => console.log('err', err));
    }}
  >
    {({ state }) =>
      state.isLoading ? (
        <div>Loading....</div>
      ) : state.data ? (
        React.cloneElement(children, { data: state.data })
      ) : (
        <div>no data :(</div>
      )
    }
  </Component>
);

export default ChartWrapper;
