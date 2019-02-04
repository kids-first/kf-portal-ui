import React from 'react';
import Component from 'react-component-component';
import { resolveSyntheticSqon } from '@arranger/components/dist/AdvancedSqonBuilder/utils';

const MOCK_INITIAL_SQONS = [
  {
    op: 'and',
    content: [
      {
        op: 'in',
        content: {
          field: 'kf_id',
          value: ['GF_YE6G3H03', 'GF_41B47P7R'],
        },
      },
      {
        op: 'not-in',
        content: {
          field: 'kf_id',
          value: ['GF_QMB8N50A', 'GF_AZ326B9H'],
        },
      },
    ],
  },
  {
    op: 'or',
    content: [
      {
        op: 'not-in',
        content: {
          field: 'kf_id',
          value: ['GF_YE6G3H03', 'GF_41B47P7R'],
        },
      },
      {
        op: 'in',
        content: {
          field: 'kf_id',
          value: ['GF_QMB8N50A', 'GF_AZ326B9H'],
        },
      },
    ],
  },
];

const SQONProvider = ({ children }) => {
  const initialState = { sqons: MOCK_INITIAL_SQONS, activeIndex: 0 };
  const setActiveSqonIndex = s => index => s.setState({ activeIndex: index });
  const setSqons = s => (sqons = s.state.sqons) => s.setState({ sqons });
  const getActiveExecutableSqon = s => () =>
    resolveSyntheticSqon(s.state.sqons)(s.state.sqons[s.state.activeIndex]);
  return (
    <Component initialState={initialState}>
      {s => {
        const {
          state: { sqons, activeIndex },
        } = s;
        return children({
          sqons,
          activeIndex,
          setActiveSqonIndex: setActiveSqonIndex(s),
          setSqons: setSqons(s),
          getActiveExecutableSqon: getActiveExecutableSqon(s),
        });
      }}
    </Component>
  );
};

export default SQONProvider;
