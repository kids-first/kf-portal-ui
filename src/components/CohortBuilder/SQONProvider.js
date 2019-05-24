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
    autobind(this);
  }

  static propTypes = {
    history: PropTypes.object.isRequired,
  };

  loadVirtualStudy(virtualStudyId) {
    if (virtualStudyId === null) {
      this.resetSqons();
      return;
    }
    this.props.loadSavedVirtualStudy(virtualStudyId);
  }

  componentDidMount() {
    const { virtualStudyId } = this.props;
    const { id: urlVirtualStudyId } = parseQueryString(this.props.history.location.search);

    // load the study in url if it is not already loaded (e.g. from local storage or previous mounting)
    if (urlVirtualStudyId && virtualStudyId !== urlVirtualStudyId) {
      this.loadVirtualStudy(urlVirtualStudyId);
      return;
    }

    // add the id of the study to the url if it is not set, yet
    if (!urlVirtualStudyId && virtualStudyId) {
      this.setStudyInUrl(virtualStudyId);
      return;
    }
  }

  componentDidUpdate(prevProps) {
    const { virtualStudyId } = this.props;
    const { virtualStudyId: prevVirtualStudyId } = prevProps;
    const { id: urlVirtualStudyId } = parseQueryString(this.props.history.location.search);
    const { id: prevUrlVirtualStudyId } = parseQueryString(prevProps.history.location.search);

    // update current virtual study when url change
    if (prevUrlVirtualStudyId !== urlVirtualStudyId && virtualStudyId !== urlVirtualStudyId) {
      this.loadVirtualStudy(urlVirtualStudyId || null);
      return;
    }

    // update url when current virtual study change
    if (virtualStudyId !== prevVirtualStudyId && virtualStudyId !== urlVirtualStudyId) {
      this.setStudyInUrl(virtualStudyId);
      return;
    }
  }

  resetSqons() {
    this.props.resetVirtualStudy();
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

  setStudyInUrl(virtualStudyId) {
    const { history } = this.props;
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

    // TODO redux - let the children call the actions?
    return children({
      sqons,
      setSqons: setSqons,
      resetSqons: this.resetSqons,
      activeIndex,
      setActiveSqonIndex: setActiveSqonIndex,
      getActiveExecutableSqon: this.getActiveExecutableSqon,
      mergeSqonToActiveIndex: this.mergeSqonToActiveIndex,
      activeVirtualStudyId: virtualStudyId,
      isOwner: uid === loggedInUser.egoId,
    });
  }
}

const mapStateToProps = state => {
  const { sqons, activeIndex, uid, virtualStudyId } = state.cohortBuilder;
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
