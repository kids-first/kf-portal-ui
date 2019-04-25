import React from 'react';
import Component from 'react-component-component';
import { compose } from 'recompose';

import { getSavedVirtualStudyNames } from 'services/virtualStudies';
import { withApi } from 'services/api';

export default compose(withApi)(({ api, children }) => {
  const initialState = {
    loading: true,
    virtualStudies: [],
  };
  const didMount = s => {
    refetch(s);
  };
  const refetch = s => {
    s.setState(
      {
        loading: true,
      },
      () =>
        getSavedVirtualStudyNames(api).then(({ data: { self: { virtualStudies } } }) => {
          s.setState({
            loading: false,
            virtualStudies,
          });
        }),
    );
  };
  return (
    <Component initialState={initialState} didMount={didMount}>
      {s =>
        children({
          loading: s.state.loading,
          virtualStudies: s.state.virtualStudies,
          refetch: () => refetch(s),
        })
      }
    </Component>
  );
});
