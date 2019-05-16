import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { injectState } from 'freactal';
import { compose } from 'recompose';
import autobind from 'auto-bind-es5';
import { parse as parseQueryString, stringify } from 'query-string';
import { connect } from 'react-redux';
import {
  resolveSyntheticSqon,
  isReference,
} from '@kfarranger/components/dist/AdvancedSqonBuilder/utils';

import {
  loadSavedVirtualStudy,
  setActiveSqonIndex,
  setSqons,
  setVirtualStudyId,
  resetVirtualStudy,
} from '../../store/actionCreators/virtualStudies';

class SQONProvider extends React.Component {
  constructor(props) {
    super(props);

    this.previousVirtualStudyId = null;
    this.previousSqons = null;
    this.previousActiveIndex = null;

    autobind(this);
  }

  static propTypes = {
    history: PropTypes.object.isRequired,
  };

  loadVirtualStudy(virtualStudyId) {
    this.previousVirtualStudyId = virtualStudyId;
    if (virtualStudyId === null) {
      this.resetSqons();
      return;
    }
    this.props.loadSavedVirtualStudy(virtualStudyId);
  }

  componentDidMount() {
    const { id: virtualStudyId } = parseQueryString(this.props.history.location.search);

    if (virtualStudyId) {
      this.loadVirtualStudy(virtualStudyId);
      return;
    }
  }

  componentDidUpdate() {
    const { virtualStudyId } = this.props;

    if (virtualStudyId !== null && virtualStudyId !== this.previousVirtualStudyId) {
      this.loadVirtualStudy(virtualStudyId);
    }
  }

  resetSqons() {
    this.props.resetVirtualStudy();
    this.setStudyInHash(null);
  }

  getActiveExecutableSqon() {
    const { sqons, activeIndex } = this.props;
    return resolveSyntheticSqon(sqons)(sqons[activeIndex]);
  }

  // takes care of putting a new sqon into place while preserving references
  // TODO - move to @kfarranger/components/dist/AdvancedSqonBuilder/utils
  mergeSqonToActiveIndex(newSqon) {
    const { sqons, activeIndex } = this.props;
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
    this.props.setSqons(updatedSqons);
  }

  setStudyInHash(virtualStudyId) {
    const { history, setVirtualStudyId } = this.props;
    setVirtualStudyId(virtualStudyId);
    history.replace({
      ...history.location,
      search: virtualStudyId ? stringify({ id: virtualStudyId }) : '',
    });
  }

  render() {
    const {
      sqons,
      activeIndex,
      uid,
      virtualStudyId,
      children,
      state: { loggedInUser },
      setActiveSqonIndex,
      setSqons,
    } = this.props;

    return children({
      sqons,
      setSqons: setSqons,
      resetSqons: this.resetSqons,
      activeIndex,
      setActiveSqonIndex: setActiveSqonIndex,
      getActiveExecutableSqon: this.getActiveExecutableSqon,
      mergeSqonToActiveIndex: this.mergeSqonToActiveIndex,
      activeVirtualStudyId: virtualStudyId,
      setActiveVirtualStudyId: this.setStudyInHash,
      isOwner: uid === loggedInUser.egoId,
    });
  }
}

const mapStateToProps = state => {
  const { sqons, activeIndex, uid, virtualStudyId } = state.virtualStudies;
  return {
    sqons,
    activeIndex,
    uid,
    virtualStudyId,
  };
};

const mapDispatchToProps = {
  loadSavedVirtualStudy,
  setActiveSqonIndex,
  setSqons,
  setVirtualStudyId,
  resetVirtualStudy,
};

export default compose(
  withRouter,
  injectState,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(SQONProvider);
