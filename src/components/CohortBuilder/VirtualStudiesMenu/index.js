import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import autobind from 'auto-bind-es5';
import { isEqual } from 'lodash';
import urlJoin from 'url-join';

// TODO - kill those once done
import { injectState } from 'freactal';

import Row from 'uikit/Row';
import { H1 } from 'uikit/Headings';

import {
  fetchVirtualStudiesCollection,
  resetVirtualStudy,
  loadSavedVirtualStudy,
  saveVirtualStudy,
  deleteVirtualStudy,
  setVirtualStudyId,
} from '../../../store/actionCreators/virtualStudies';

import Tooltip from 'uikit/Tooltip';
import { WhiteButton } from 'uikit/Button.js';

import ShareQuery from 'components/LoadShareSaveDeleteQuery/ShareQuery';
import LoadQuery from 'components/LoadShareSaveDeleteQuery/LoadQuery';
import OpenMenuIcon from 'react-icons/lib/fa/folder';
import SaveIcon from 'react-icons/lib/fa/file';
import DeleteIcon from 'react-icons/lib/fa/trash';

import SaveVirtualStudiesModalContent from '../SaveVirtualStudiesModalContent';
import DeleteVirtualStudiesModalContent from '../DeleteVirtualStudiesModalContent';

import './index.css';

const defaultSqon = [{ op: 'and', content: [] }];

class VirtualStudiesMenu extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  static propTypes = {
    setActiveVirtualStudyId: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { uid, fetchVirtualStudiesCollection } = this.props;
    if (uid !== null) {
      fetchVirtualStudiesCollection(uid);
    }
  }

  componentDidUpdate(prevProps) {
    const { uid, fetchVirtualStudiesCollection } = this.props;
    if (uid !== null && uid !== prevProps.uid) {
      fetchVirtualStudiesCollection(uid);
    }
  }

  onSaveAsClick() {
    this.props.effects.setModal({
      title: 'Save as Virtual Study',
      classNames: {
        modal: 'virtual-study-modal',
      },
      component: <SaveVirtualStudiesModalContent />,
    });
  }

  onDeleteClick() {
    this.props.effects.setModal({
      title: `Delete Virtual Study`,
      classNames: {
        modal: 'virtual-study-modal',
      },
      component: <DeleteVirtualStudiesModalContent />,
    });
  }

  getSharableUrl({ id }) {
    return urlJoin(
      window.location.origin,
      this.props.history.createHref({
        ...this.props.history.location,
        search: `id=${id}`,
      }),
    );
  }

  findSelectedStudy() {
    const { virtualStudies, activeVirtualStudyId } = this.props;
    return virtualStudies.filter(study => study.id === activeVirtualStudyId).shift();
  }

  // TODO JB rename
  shizzle(virtualStudyId) {
    this.props.loadSavedVirtualStudy(virtualStudyId).then(() => {
      this.props.setActiveVirtualStudyId(virtualStudyId);
    });
  }

  render() {
    const { virtualStudyListIsLoading, virtualStudies, activeVirtualStudyId, sqons } = this.props;
    const selectedStudy = this.findSelectedStudy();
    const syntheticSqonIsEmpty = isEqual(sqons, defaultSqon);
    const newDisabled = virtualStudyListIsLoading || !selectedStudy || !selectedStudy.id;
    const sharingEnabled = !!activeVirtualStudyId;

    return (
      <Row className="virtual-studies-menu contentainer">
        <Row className="virtual-studies-menu content">
          <Row>
            <H1 className="heading-with-study">
              {selectedStudy ? `Virtual Study: ${selectedStudy.name}` : 'Explore Data'}
            </H1>
          </Row>
        </Row>

        <Row className="virtual-studies-action-bar">
          <Tooltip html={<div>Create a new virtual study</div>} className="virtual-studies-new">
            <WhiteButton
              disabled={newDisabled}
              onClick={() => {
                this.props.resetVirtualStudy();
              }}
            >
              <span>
                <OpenMenuIcon height={11} width={11} />
              </span>
              <span className="new-button">New</span>
            </WhiteButton>
          </Tooltip>

          <Tooltip html={<div>Open a saved virtual study</div>} className="virtual-studies-open">
            <LoadQuery
              studies={virtualStudies}
              selection={selectedStudy}
              handleOpen={this.shizzle}
              disabled={
                virtualStudyListIsLoading ||
                (virtualStudies.length === 1 && selectedStudy && selectedStudy.id) ||
                virtualStudies.length < 1
              }
            />
          </Tooltip>

          <Tooltip
            html={
              <div>
                {activeVirtualStudyId ? 'Save as a new virtual study' : 'Save a virtual study'}
              </div>
            }
            className="virtual-studies-save"
          >
            <WhiteButton
              disabled={virtualStudyListIsLoading || syntheticSqonIsEmpty}
              onClick={this.onSaveAsClick}
              className="save-button"
            >
              <span>
                <SaveIcon height={10} width={10} className="save-icon" />
              </span>
              <span className="save-text">{activeVirtualStudyId ? 'Save As' : 'Save'}</span>
            </WhiteButton>
          </Tooltip>

          <Tooltip html={<div>Delete this virtual study</div>} className="virtual-studies-delete">
            <WhiteButton
              disabled={!activeVirtualStudyId}
              onClick={this.onDeleteClick}
              className="delete-button"
            >
              <span>
                <DeleteIcon className="delete-icon" />
              </span>
              <span className="delete-text">
                <Trans>delete</Trans>
              </span>
            </WhiteButton>
          </Tooltip>

          <Tooltip html={<div>Share this virtual study</div>} className="virtual-studies-share">
            <ShareQuery
              disabled={!sharingEnabled}
              getSharableUrl={this.getSharableUrl}
              handleShare={() => Promise.resolve({ id: activeVirtualStudyId })}
            />
          </Tooltip>
        </Row>
      </Row>
    );
  }
}

const mapStateToProps = state => {
  const { user, cohortBuilder, virtualStudies } = state;
  return {
    uid: user.uid,
    loggedInUser: user.loggedInUser,
    sqons: cohortBuilder.sqons,
    activeVirtualStudyId: cohortBuilder.virtualStudyId,
    virtualStudies: virtualStudies.studies,
    virtualStudyListIsLoading: virtualStudies.isLoading,
  };
};

const mapDispatchToProps = {
  fetchVirtualStudiesCollection,
  resetVirtualStudy,
  loadSavedVirtualStudy,
  saveVirtualStudy,
  deleteVirtualStudy,
  setVirtualStudyId,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withRouter,
  injectState,
)(VirtualStudiesMenu);
