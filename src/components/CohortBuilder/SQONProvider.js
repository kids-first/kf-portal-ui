import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { injectState } from 'freactal';
import { compose } from 'recompose';
import autobind from 'auto-bind-es5';
import { parse as parseQueryString, stringify } from 'query-string';
import { cloneDeep } from 'lodash';
import {
  resolveSyntheticSqon,
  isReference,
} from '@kfarranger/components/dist/AdvancedSqonBuilder/utils';

import { withApi } from 'services/api';
import { getVirtualStudy } from 'services/virtualStudies';

const COHORT_BUILDER_FILTER_STATE = 'COHORT_BUILDER_FILTER_STATE';
const initialState = {
  sqons: [
    {
      op: 'and',
      content: [],
    },
  ],
  activeIndex: 0,
  uid: null,
  virtualStudyId: null,
};

class SQONProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...cloneDeep(initialState) };

    this.previousVirtualStudyId = null;
    this.previousSqons = null;
    this.previousActiveIndex = null;

    this.getVirtualStudy = getVirtualStudy(props.api);
    autobind(this);
  }

  static propTypes = {
    api: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  };

  async loadVirtualStudy(virtualStudyId) {
    this.previousVirtualStudyId = virtualStudyId;

    if (virtualStudyId === null) {
      this.resetSqons();
      return;
    }

    return this.getVirtualStudy(virtualStudyId)
      .then(virtualStudy => {
        const {
          uid,
          content: { sqons, activeIndex },
        } = virtualStudy;
        this.setState(
          {
            sqons,
            activeIndex,
            uid,
            virtualStudyId,
          },
          this.saveLocalSqons,
        );
      })
      .catch(err => {
        // something went wrong, reset the state in local storage
        // TODO - display error message
        console.error(err);
      });
  }

  saveLocalSqons() {
    const { sqons, activeIndex, uid } = this.state;
    const filterState = JSON.stringify({
      sqons,
      activeIndex,
      uid,
    });

    // TODO : use `egoId` in the key of the virtual study
    localStorage.setItem(COHORT_BUILDER_FILTER_STATE, filterState);
  }

  loadLocalSqons() {
    // const { state: { loggedInUser: { egoId }}} = this.props;
    // TODO : use `egoId` in the key of the virtual study
    const savedLocalState = localStorage.getItem(COHORT_BUILDER_FILTER_STATE);
    if (savedLocalState) {
      let filterState = JSON.parse(savedLocalState);
      this.setState({ ...filterState });
    }
  }

  componentDidMount() {
    const { id: virtualStudyId } = parseQueryString(this.props.history.location.search);

    this.loadLocalSqons();

    if (virtualStudyId) {
      this.loadVirtualStudy(virtualStudyId);
      return;
    }
  }

  componentDidUpdate() {
    const { virtualStudyId } = this.state;

    if (virtualStudyId !== null && virtualStudyId !== this.previousVirtualStudyId) {
      this.loadVirtualStudy(virtualStudyId);
    }
  }

  setActiveSqonIndex(index) {
    this.setState({ activeIndex: index }, this.saveLocalSqons);
  }

  setSqons(sqons) {
    this.setState({ sqons }, this.saveLocalSqons);
  }

  resetSqons() {
    this.setState(
      {
        sqons: cloneDeep(initialState.sqons),
        activeIndex: initialState.activeIndex,
        uid: initialState.uid,
        virtualStudyId: initialState.virtualStudyId,
      },
      this.saveLocalSqons,
    );
    this.setStudyInHash(null);
  }

  getActiveExecutableSqon() {
    const { sqons, activeIndex } = this.state;
    return resolveSyntheticSqon(sqons)(sqons[activeIndex]);
  }

  // takes care of putting a new sqon into place while preserving references
  // TODO - move to @kfarranger/components/dist/AdvancedSqonBuilder/utils
  mergeSqonToActiveIndex(newSqon) {
    const { sqons, activeIndex } = this.state;
    const updatedSqons = sqons.map((currentSqon, i) =>
      i === activeIndex
        ? {
            ...currentSqon,
            content: newSqon.content.map((newContent, _i) =>
              isReference(currentSqon.content[_i]) ? currentSqon.content[_i] : newContent,
            ),
          }
        : currentSqon,
    );
    this.setSqons(updatedSqons);
  }

  setStudyInHash(virtualStudyId) {
    const { history } = this.props;
    this.setState({ virtualStudyId }, () => {
      history.replace({
        ...history.location,
        search: virtualStudyId ? stringify({ id: virtualStudyId }) : '',
      });
    });
  }

  render() {
    // TODO - move `loggedInUser` to props
    const {
      children,
      state: { loggedInUser },
    } = this.props;
    const { sqons, activeIndex, uid, virtualStudyId } = this.state;

    return children({
      sqons,
      setSqons: this.setSqons,
      resetSqons: this.resetSqons,
      activeIndex,
      setActiveSqonIndex: this.setActiveSqonIndex,
      getActiveExecutableSqon: this.getActiveExecutableSqon,
      mergeSqonToActiveIndex: this.mergeSqonToActiveIndex,
      activeVirtualStudyId: virtualStudyId,
      setActiveVirtualStudyId: this.setStudyInHash,
      isOwner: uid === loggedInUser.egoId,
    });
  }
}

export default compose(
  withApi,
  withRouter,
  injectState,
)(SQONProvider);
