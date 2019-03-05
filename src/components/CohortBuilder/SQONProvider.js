import React from 'react';
import Component from 'react-component-component';
import {
  resolveSyntheticSqon,
  isReference,
} from '@arranger/components/dist/AdvancedSqonBuilder/utils';

const COHORT_BUILDER_FILTER_STATE = 'COHORT_BUILDER_FILTER_STATE';

const SQONProvider = ({ children }) => {
  const initialState = {
    sqons: [
      {
        op: 'and',
        content: [],
      },
    ],
    activeIndex: 0,
  };
  const didMount = s => {
    if (localStorage[COHORT_BUILDER_FILTER_STATE]) {
      const localState = JSON.parse(localStorage[COHORT_BUILDER_FILTER_STATE]);
      s.setState({
        sqons: localState.sqons,
        activeIndex: localState.activeIndex,
      });
    }
  };
  const didUpdate = s => {
    localStorage.setItem(COHORT_BUILDER_FILTER_STATE, JSON.stringify(s.state));
  };

  const setActiveSqonIndex = s => index => s.setState({ activeIndex: index });
  const setSqons = s => (sqons = s.state.sqons) => s.setState({ sqons });
  // takes care of putting a new sqon into place while preserving references
  const mergeSqonToActiveIndex = s => newSqon =>
    setSqons(s)(
      s.state.sqons.map((currentSqon, i) =>
        i === s.state.activeIndex
          ? {
              ...currentSqon,
              content: newSqon.content.map((newContent, _i) =>
                isReference(currentSqon.content[_i]) ? currentSqon.content[_i] : newContent,
              ),
            }
          : currentSqon,
      ),
    );
  const getActiveExecutableSqon = s => () =>
    resolveSyntheticSqon(s.state.sqons)(s.state.sqons[s.state.activeIndex]);

  return (
    <Component initialState={initialState} didMount={didMount} didUpdate={didUpdate}>
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
          mergeSqonToActiveIndex: mergeSqonToActiveIndex(s),
        });
      }}
    </Component>
  );
};

export default SQONProvider;
