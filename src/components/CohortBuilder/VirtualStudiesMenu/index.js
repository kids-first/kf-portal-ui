import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Trans } from 'react-i18next';
import autobind from 'auto-bind-es5';
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
} from '../../../store/actionCreators/virtualStudies';

import Tooltip from 'uikit/Tooltip';
import { WhiteButton } from 'uikit/Button.js';

import ShareQuery from 'components/LoadShareSaveDeleteQuery/ShareQuery';
import LoadQuery from 'components/LoadShareSaveDeleteQuery/LoadQuery';
import OpenMenuIcon from 'react-icons/lib/fa/folder';
import SaveAsIcon from 'react-icons/lib/fa/file';
import SaveIcon from 'react-icons/lib/fa/floppy-o';
import EditIcon from 'react-icons/lib/fa/edit';
import DeleteIcon from 'react-icons/lib/fa/trash';

import SaveVirtualStudiesModalContent from '../SaveVirtualStudiesModalContent';
import DeleteVirtualStudiesModalContent from '../DeleteVirtualStudiesModalContent';

import './index.postcss';

const VirtualStudiesMenuButton = ({
  tooltipText,
  onClick,
  label,
  icon: Icon,
  iconProps = {},
  disabled = false,
  className = '',
}) => (
  <Tooltip html={<div>{tooltipText}</div>} className={`button-group tooltip ${className}`}>
    <WhiteButton disabled={disabled} onClick={onClick}>
      <span>
        <Icon height={10} width={10} className="button-icon" {...iconProps} />
      </span>
      <span className="button-text">{label}</span>
    </WhiteButton>
  </Tooltip>
);

class VirtualStudiesMenu extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

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

  onNewClick() {
    this.props.resetVirtualStudy();
  }

  onSaveClick() {
    const {
      loggedInUser,
      sqons,
      activeIndex,
      activeVirtualStudyId: virtualStudyId,
      virtualStudyName: name,
      description,
      saveVirtualStudy,
    } = this.props;

    return saveVirtualStudy({
      loggedInUser,
      sqonsState: {
        sqons,
        activeIndex,
        virtualStudyId,
      },
      name,
      description,
    }).catch(err => {
      console.error('Error while saving the virtual study', err);
    });
  }

  onEditClick() {
    this.props.effects.setModal({
      title: 'Edit Virtual Study',
      classNames: {
        modal: 'virtual-study-modal',
      },
      component: <SaveVirtualStudiesModalContent />,
    });
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

  handleOpen(virtualStudyId) {
    this.props.loadSavedVirtualStudy(virtualStudyId);
  }

  render() {
    const {
      activeVirtualStudyId,
      virtualStudyIsLoading,
      virtualStudyName,
      virtualStudies,
      virtualStudiesAreLoading,
      isOwner,
      isDirty,
      areSqonsEmpty,
    } = this.props;
    const selectedStudy = this.findSelectedStudy();

    const loading = virtualStudiesAreLoading || virtualStudyIsLoading;
    const newDisabled = loading || areSqonsEmpty;
    const cantOpen =
      loading ||
      (virtualStudies.length === 1 && selectedStudy && selectedStudy.id) ||
      virtualStudies.length < 1;
    const cantEdit = loading || areSqonsEmpty || !isOwner;
    const cantSave = loading || areSqonsEmpty || !isOwner || !isDirty;
    const cantSaveAs = loading || areSqonsEmpty;
    const cantDelete = loading || !activeVirtualStudyId || !isOwner;
    const cantShare = loading || !activeVirtualStudyId || !isOwner;

    const titleFragment = virtualStudyName ? 'Virtual Study: ' : 'Explore Data';
    const title = `${titleFragment} ${virtualStudyName}${
      activeVirtualStudyId && isDirty ? '*' : ''
    }`;

    return (
      <Row className="virtual-studies-menu container">
        <Row className="virtual-studies-heading">
          <H1>
            {title}
            {<p>{activeVirtualStudyId && isDirty ? 'You have unsaved changes' : ''}&nbsp;</p>}
          </H1>
          {activeVirtualStudyId ? (
            <Tooltip
              html={<div>{'Edit the current virtual study'}</div>}
              className="tooltip virtual-studies-edit"
            >
              <EditIcon
                disabled={cantEdit}
                height={16}
                width={16}
                className="floating-button-icon"
                onClick={this.onEditClick}
              />
            </Tooltip>
          ) : null}
        </Row>

        <Row className="virtual-studies-action-bar">
          <VirtualStudiesMenuButton
            label={'New'}
            tooltipText={'Create a new virtual study'}
            icon={OpenMenuIcon}
            iconProps={{ height: 11, width: 11 }}
            disabled={newDisabled}
            onClick={this.onNewClick}
            className="virtual-studies-new"
          />

          <Tooltip
            html={<div>Open a saved virtual study</div>}
            className="virtual-studies-open button-group"
          >
            <LoadQuery
              studies={virtualStudies}
              selection={selectedStudy}
              handleOpen={this.handleOpen}
              disabled={cantOpen}
            />
          </Tooltip>

          {/* <VirtualStudiesMenuButton
            label={'Edit'}
            tooltipText={'Edit the current virtual study'}
            icon={EditIcon}
            iconProps={{ height: 12, width: 12 }}
            disabled={cantEdit}
            onClick={this.onEditClick}
            className="virtual-studies-edit"
          /> */}

          <VirtualStudiesMenuButton
            label={'Save'}
            tooltipText={'Saves the current virtual study if it exists, or a new one if not'}
            icon={SaveIcon}
            iconProps={{ height: 12, width: 12 }}
            disabled={cantSave}
            onClick={this.onSaveClick}
            className="virtual-studies-save"
          />

          <VirtualStudiesMenuButton
            label={'Save as'}
            tooltipText={'Saves the current virtual study as a new one'}
            icon={SaveAsIcon}
            disabled={cantSaveAs}
            onClick={this.onSaveAsClick}
            className="virtual-studies-save-as"
          />

          <VirtualStudiesMenuButton
            label={<Trans>delete</Trans>}
            tooltipText={'Delete this virtual study'}
            icon={DeleteIcon}
            disabled={cantDelete}
            onClick={this.onDeleteClick}
            className="virtual-studies-delete"
          />

          <Tooltip
            html={<div>Share this virtual study</div>}
            className="virtual-studies-share button-group"
          >
            <ShareQuery
              disabled={cantShare}
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
    isOwner: cohortBuilder.uid === user.uid,
    sqons: cohortBuilder.sqons,
    activeIndex: cohortBuilder.activeIndex,
    activeVirtualStudyId: cohortBuilder.virtualStudyId,
    virtualStudyName: cohortBuilder.name,
    description: cohortBuilder.description,
    virtualStudyIsLoading: cohortBuilder.isLoading,
    virtualStudies: virtualStudies.studies,
    virtualStudiesAreLoading: virtualStudies.isLoading,
    isDirty: cohortBuilder.dirty,
    areSqonsEmpty: cohortBuilder.areSqonsEmpty,
  };
};

const mapDispatchToProps = {
  fetchVirtualStudiesCollection,
  resetVirtualStudy,
  loadSavedVirtualStudy,
  saveVirtualStudy,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withRouter,
  injectState,
)(VirtualStudiesMenu);
