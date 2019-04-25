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
    lastAction: null,
    uid: null,
  };

  const didMount = s => {
    if (virtualStudyId) {
      loadVirtualStudy(s)(virtualStudyId).catch(console.err);
      return;
    }

    const savedLocalState = localStorage.getItem(COHORT_BUILDER_FILTER_STATE);
    if (savedLocalState) {
      let localState = JSON.parse(savedLocalState);
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
      if (!virtualStudyId) {
        localStorage.setItem(COHORT_BUILDER_FILTER_STATE, JSON.stringify(initialState));
        return;
      }

      loadVirtualStudy(s)(virtualStudyId)
        .then(virtualStudy => {
          let filterState;
          try {
            filterState = JSON.stringify({
              sqons: virtualStudy.content.sqons,
              activeIndex: virtualStudy.content.activeIndex,
              uid: virtualStudy,
            });
          } catch (err) {
            // something went wrong, reset the state in local storage
            filterState = JSON.stringify(initialState);
          }
          localStorage.setItem(COHORT_BUILDER_FILTER_STATE, filterState);
        })
        .catch(err => {
          console.error(err);
          // something went wrong, reset the state in local storage
          localStorage.setItem(COHORT_BUILDER_FILTER_STATE, JSON.stringify(initialState));
        });
    }
  };

  const loadVirtualStudy = ({ setState }) => async virtualStudyId => {
    return getVirtualStudy(api)(virtualStudyId).then(virtualStudy => {
      const {
        uid,
        content: { sqons, activeIndex },
      } = virtualStudy;
      setState({ sqons, activeIndex, uid });
    });
  };

  /**
   * utilities for children
   **/
  const setActiveSqonIndex = s => index => {
    s.setState({ activeIndex: index });
  };
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

  const setStudyInHash = id => {
    // set the current study by the hash,
    //  it will flow back from `didUpdate`
    history.replace({
      ...history.location,
      search: id ? stringify({ id }) : '',
    });
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
          setSqons: setSqons(s),
          activeIndex,
          setActiveSqonIndex: setActiveSqonIndex(s),
          getActiveExecutableSqon: getActiveExecutableSqon(s),
          mergeSqonToActiveIndex: mergeSqonToActiveIndex(s),
          activeVirtualStudyId: virtualStudyId,
          setActiveVirtualStudyId: setStudyInHash,
          isOwner: uid === loggedInUser.egoId,
        });
      }}
    </Component>
  );
});

export default SQONProvider;
