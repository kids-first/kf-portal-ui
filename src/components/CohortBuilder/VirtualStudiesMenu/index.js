import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Trans } from 'react-i18next';
import autobind from 'auto-bind-es5';
import urlJoin from 'url-join';
import { injectState } from 'freactal';

import Row from 'uikit/Row';
import { H1 } from 'uikit/Headings';

import {
  fetchVirtualStudiesCollection,
  resetVirtualStudy,
  loadSavedVirtualStudy,
  saveVirtualStudy,
} from '../../../store/actionCreators/virtualStudies';
import { createVirtualStudy } from 'services/virtualStudies';

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
import GenericErrorDisplay from 'uikit/GenericErrorDisplay';

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

const generateDescription = (content) => {
  const descriptionLines = content.trim().split(/\n/);
  const jsx = descriptionLines.slice(0, 3).map((line, i) => (
    <p style={{
      overflow: 'hidden',
      wordBreak: 'break-word',
      margin: 0,
      fontFamily: '"Open Sans", "sans-serif"',
      fontSize: "16px",
      paddingBottom: "8px",
      paddingTop: "8px"
    }} key={i}>
      {line}&nbsp;
    </p>
  ));

  return (descriptionLines.length > 3 ? <Tooltip html={(<span>{content}</span>)}>{jsx}</Tooltip> : jsx )
};

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

    // if there is no virtual study loaded yet, save a new one instead
    if (!virtualStudyId) {
      return this.onSaveAsClick();
    }

    const study = createVirtualStudy(virtualStudyId, name, description, sqons, activeIndex);

    return saveVirtualStudy(loggedInUser, study).catch(err => {
      console.error('Error while saving the virtual study', err);
    });
  }

  onEditClick() {
    this.props.effects.setModal({
      title: 'Edit Virtual Study Name and Description',
      classNames: {
        modal: 'virtual-study-modal',
      },
      component: <SaveVirtualStudiesModalContent saveAs={false} />,
    });
  }

  onSaveAsClick() {
    this.props.effects.setModal({
      title: 'Save as Virtual Study',
      classNames: {
        modal: 'virtual-study-modal',
      },
      component: <SaveVirtualStudiesModalContent saveAs={true} />,
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

  getSharableUrl({ id: virtualStudyId }) {
    return urlJoin(
      window.location.origin,
      this.props.history.createHref({
        ...this.props.history.location,
        search: `id=${virtualStudyId}`,
      }),
    );
  }

  findSelectedStudy() {
    const { virtualStudies, activeVirtualStudyId } = this.props;
    return virtualStudies.filter(study => study.virtualStudyId === activeVirtualStudyId)[0];
  }

  handleOpen(virtualStudyId) {
    this.props.loadSavedVirtualStudy(virtualStudyId);
  }

  render() {
    const {
      activeVirtualStudyId,
      virtualStudyIsLoading,
      virtualStudyName,
      description,
      virtualStudies,
      virtualStudiesAreLoading,
      isOwner,
      isDirty,
      areSqonsEmpty,
      error,
    } = this.props;
    const selectedStudy = this.findSelectedStudy();

    const loading = virtualStudiesAreLoading || virtualStudyIsLoading;
    const newDisabled = selectedStudy !== undefined ? false : loading || areSqonsEmpty;
    const cantOpen =
      loading ||
      (virtualStudies.length === 1 && selectedStudy && selectedStudy.virtualStudyId) ||
      virtualStudies.length < 1;
    const cantEdit = loading || areSqonsEmpty || !isOwner;
    const cantSaveAs = activeVirtualStudyId ? loading || areSqonsEmpty : true;
    const cantDelete = loading || !activeVirtualStudyId || !isOwner;
    const cantShare = loading || !activeVirtualStudyId || !isOwner;

    const titleFragment = virtualStudyName ? '' : 'Explore Data';
    const title = `${titleFragment} ${virtualStudyName}${
      activeVirtualStudyId && isDirty ? '*' : ''
    }`;

    if (error) {
      return <GenericErrorDisplay error={error} />;
    }

    return (
      <Row className="virtual-studies-menu container">
        <Row className="virtual-studies-heading">
          <header>
            <H1>{title}</H1>

            {activeVirtualStudyId ? (
              <Tooltip
                html={<div>{'Edit name and description'}</div>}
                className="tooltip virtual-studies-edit"
              >
                {!isOwner ? null : (
                  <EditIcon
                    disabled={cantEdit}
                    height={16}
                    width={16}
                    className="floating-button-icon"
                    onClick={this.onEditClick}
                  />
                )}
              </Tooltip>
            ) : null}
          </header>

          {isDirty ? <div className="dirty">You have unsaved changes</div> : null}

          <div className={`${description.trim().length ? '' : 'empty'}`}>
            { generateDescription(description) }
          </div>
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

          <VirtualStudiesMenuButton
            label={'Save'}
            tooltipText={'Saves the current virtual study if it exists, or a new one if not'}
            icon={SaveIcon}
            iconProps={{ height: 12, width: 12 }}
            disabled={!isDirty}
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
  const { user, currentVirtualStudy, virtualStudies } = state;
  return {
    uid: user.uid,
    loggedInUser: user.loggedInUser,
    virtualStudies: virtualStudies.studies,
    virtualStudiesAreLoading: virtualStudies.isLoading,
    isOwner: currentVirtualStudy.uid === user.uid,
    sqons: currentVirtualStudy.sqons,
    activeIndex: currentVirtualStudy.activeIndex,
    activeVirtualStudyId: currentVirtualStudy.virtualStudyId,
    virtualStudyName: currentVirtualStudy.name,
    description: currentVirtualStudy.description,
    virtualStudyIsLoading: currentVirtualStudy.isLoading,
    isDirty: currentVirtualStudy.dirty,
    areSqonsEmpty: currentVirtualStudy.areSqonsEmpty,
    error: currentVirtualStudy.error,
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
