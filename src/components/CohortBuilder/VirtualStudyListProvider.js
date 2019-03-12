import React from 'react';
import Component from 'react-component-component';
import { compose } from 'recompose';
import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { withApi } from 'services/api';

export default compose(withApi)(({ api, onUpdate = () => {}, children }) => {
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
          onUpdate({ virtualStudies });
        }),
    );
  };
  const getSavedVirtualStudyNames = async api =>
    api({
      url: 'http://localhost:3232/graphql/PERSONA_SAVED_VIRTUAL_STUDIES',
      body: {
        query: print(gql`
          {
            self {
              virtualStudies {
                id
                name
              }
            }
          }
        `),
      },
    });
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
