import React from 'react';
import Component from 'react-component-component';
import { withRouter } from 'react-router-dom';
import { injectState } from 'freactal';
import { compose } from 'recompose';
import {
  resolveSyntheticSqon,
  isReference,
} from '@arranger/components/dist/AdvancedSqonBuilder/utils';
import { parse as parseQueryString, stringify } from 'query-string';

import { withApi } from 'services/api';
import { getVirtualStudy } from 'services/virtualStudies';

const SQONProvider = compose(
  withApi,
  withRouter,
  injectState,
)(({ api, history, children, state: { loggedInUser } }) => {
  const COHORT_BUILDER_FILTER_STATE = 'COHORT_BUILDER_FILTER_STATE';
  const { id: virtualStudyId } = parseQueryString(history.location.search);
  const initialState = {
    sqons: [
      {
        op: 'and',
        content: [],
      },
    ],
    activeIndex: 0,
    uid: null,
  };
  const didMount = s => {
    const savedLocalState = localStorage[COHORT_BUILDER_FILTER_STATE];
    if (virtualStudyId) {
      syncWithHistory(s)(virtualStudyId);
    } else if (savedLocalState) {
      const localState = JSON.parse(savedLocalState);
      s.setState({
        sqons: localState.sqons,
        activeIndex: localState.activeIndex,
      });
    }
  };
  const didUpdate = s => {
    const {
      props: { virtualStudyId },
      prevProps: { virtualStudyId: previousVirtualStudyId },
    } = s;
    if (virtualStudyId !== previousVirtualStudyId) {
      syncWithHistory(s)(virtualStudyId);
    }
    localStorage.setItem(
      COHORT_BUILDER_FILTER_STATE,
      JSON.stringify({
        sqons: s.state.sqons,
        activeIndex: s.state.activeIndex,
      }),
    );
  };

  const syncWithHistory = ({ setState }) => virtualStudyId =>
    getVirtualStudy(api)(virtualStudyId).then(({ content, uid }) => {
      setState({
        sqons: content.sqons,
        activeIndex: content.activeIndex,
        uid,
      });
    });

  /**
   * utilities for children
   **/
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
  const onVirtualStudySelect = history => id => {
    history.replace({
      ...history.location,
      search: stringify({ id }),
    });
  };

  const setVirtualStudy = s => id => {
    history.replace({
      ...history.location,
      search: stringify({ id }),
    });
    syncWithHistory(s);
  };

  return (
    <Component
      virtualStudyId={virtualStudyId}
      initialState={initialState}
      didMount={didMount}
      didUpdate={didUpdate}
    >
      {s => {
        const {
          state: { sqons, activeIndex, uid },
        } = s;
        return children({
          sqons,
          activeIndex,
          setActiveSqonIndex: setActiveSqonIndex(s),
          setSqons: setSqons(s),
          getActiveExecutableSqon: getActiveExecutableSqon(s),
          mergeSqonToActiveIndex: mergeSqonToActiveIndex(s),
          selectedVirtualStudy: virtualStudyId,
          onVirtualStudySelect: onVirtualStudySelect(history),
          setVirtualStudy: setVirtualStudy(s),
          isOwner: uid === loggedInUser.egoId,
        });
      }}
    </Component>
  );
});

export default SQONProvider;
