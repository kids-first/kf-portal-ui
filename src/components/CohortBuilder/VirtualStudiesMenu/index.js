import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  DeleteOutlined,
  EditTwoTone,
  FileOutlined,
  FolderOpenFilled,
  SaveOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import urlJoin from 'url-join';

import ShareQuery from 'components/LoadShareSaveDeleteQuery/ShareQuery';
import { createVirtualStudy } from 'services/virtualStudies';
import {
  fetchVirtualStudiesCollection,
  loadSavedVirtualStudy,
  resetVirtualStudy,
  saveVirtualStudy,
} from 'store/actionCreators/virtualStudies';
import { closeModal, openModal } from 'store/actions/modal';
import { selectUser } from 'store/selectors/users';
import GenericErrorDisplay from 'uikit/GenericErrorDisplay';
import Row from 'uikit/Row';

import SaveVirtualStudiesModal from '../SaveVirtualStudiesModal';

import LoadQuery from './LoadQuery';
import { VirtualStudiesMenuButton } from './VirtualStudiesMenuButton';

import './index.scss';

const generateDescription = (content) => {
  const descriptionLines = content.trim().split(/\n/);
  const jsx = descriptionLines.slice(0, 3).map((line, i) => (
    <p className={'virtual-study-description'} key={i}>
      {line}&nbsp;
    </p>
  ));

  return descriptionLines.length > 3 ? <Tooltip html={<span>{content}</span>}>{jsx}</Tooltip> : jsx;
};

const VS_SAVE_MODAL_ID = 'VS_SAVE_MODAL_ID';
const VS_EDIT_MODAL_ID = 'VS_EDIT_MODAL_ID';

const MODAL_PARAMS = {
  [VS_SAVE_MODAL_ID]: {
    title: 'Edit Virtual Study Name and Description',
    saveAs: false,
  },
  [VS_EDIT_MODAL_ID]: {
    title: 'Save as Virtual Study',
    saveAs: true,
  },
};

class VirtualStudiesMenu extends React.Component {
  static propTypes = {
    uid: PropTypes.string,
    fetchVirtualStudiesCollection: PropTypes.func.isRequired,
    resetVirtualStudy: PropTypes.func.isRequired,
    user: PropTypes.object,
    saveVirtualStudy: PropTypes.func.isRequired,
    sqons: PropTypes.array,
    activeIndex: PropTypes.number,
    description: PropTypes.string,
    virtualStudyName: PropTypes.string,
    activeVirtualStudyId: PropTypes.string,
    openModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    virtualStudies: PropTypes.array.isRequired,
    loadSavedVirtualStudy: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    setVirtualStudyToDeleteCB: PropTypes.func.isRequired,
    setShowDelVSModalCB: PropTypes.func.isRequired,
    virtualStudyIsLoading: PropTypes.bool.isRequired,
    openModalId: PropTypes.string,
    error: PropTypes.object,
    isDirty: PropTypes.bool,
    isOwner: PropTypes.bool,
    virtualStudiesAreLoading: PropTypes.bool,
    areSqonsEmpty: PropTypes.bool,
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

  onNewClick = () => this.props.resetVirtualStudy();

  onSaveClick = async () => {
    const {
      user,
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

    try {
      await saveVirtualStudy(user, study);
    } catch (err) {
      console.error('Error while saving the virtual study', err);
    }
  };

  onEditClick = () => this.props.openModal(VS_EDIT_MODAL_ID);

  onSaveAsClick = () => this.props.openModal(VS_SAVE_MODAL_ID);

  onDeleteClick = () => {
    const { setVirtualStudyToDeleteCB, setShowDelVSModalCB } = this.props;
    setShowDelVSModalCB(true);
    setVirtualStudyToDeleteCB({ ...this.findSelectedStudy() });
  };

  getSharableUrl = ({ id: virtualStudyId }) =>
    urlJoin(
      window.location.origin,
      this.props.history.createHref({
        ...this.props.history.location,
        search: `id=${virtualStudyId}`,
      }),
    );

  findSelectedStudy = () => {
    const { virtualStudies, activeVirtualStudyId } = this.props;
    return virtualStudies.filter((study) => study.virtualStudyId === activeVirtualStudyId)[0];
  };

  handleOpen = (virtualStudyId) => this.props.loadSavedVirtualStudy(virtualStudyId);

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
      openModalId,
      closeModal,
      user,
      uid,
      loadSavedVirtualStudy,
    } = this.props;
    const selectedStudy = this.findSelectedStudy();

    const loading = virtualStudiesAreLoading || virtualStudyIsLoading;
    const newDisabled = selectedStudy !== undefined ? false : loading || areSqonsEmpty;
    const cantOpen =
      loading ||
      (virtualStudies.length === 1 && selectedStudy && !!selectedStudy.virtualStudyId) ||
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
    const showModal = [VS_SAVE_MODAL_ID, VS_EDIT_MODAL_ID].includes(openModalId);
    return (
      <>
        {showModal && (
          <SaveVirtualStudiesModal
            saveAs={MODAL_PARAMS[openModalId].saveAs}
            title={MODAL_PARAMS[openModalId].title}
            onCloseCB={() => closeModal(openModalId)}
            uid={uid}
          />
        )}
        <Row className="virtual-studies-menu container">
          <Row className="virtual-studies-heading">
            <header>
              <h1>{title}</h1>

              {activeVirtualStudyId && (
                <Tooltip
                  title={<div>{'Edit name and description'}</div>}
                  className="tooltip virtual-studies-edit"
                >
                  {isOwner && (
                    <EditTwoTone
                      disabled={cantEdit}
                      className="floating-button-icon"
                      onClick={this.onEditClick}
                    />
                  )}
                </Tooltip>
              )}
            </header>

            {isDirty ? <div className="dirty">You have unsaved changes</div> : null}

            <div className={`${description.trim().length ? '' : 'empty'}`}>
              {generateDescription(description)}
            </div>
          </Row>

          <Row className="virtual-studies-action-bar">
            <VirtualStudiesMenuButton
              label={'New'}
              tooltipText={'Create a new virtual study'}
              icon={<FolderOpenFilled />}
              disabled={newDisabled}
              onClick={this.onNewClick}
              className="button-group"
            />

            <LoadQuery
              studies={virtualStudies}
              selection={selectedStudy}
              disabled={cantOpen}
              classNameBtn="button-group"
              loadSavedVirtualStudy={loadSavedVirtualStudy}
            />

            <VirtualStudiesMenuButton
              label={'Save'}
              tooltipText={'Saves the current virtual study if it exists, or a new one if not'}
              icon={<SaveOutlined />}
              disabled={!isDirty}
              onClick={this.onSaveClick}
              className="button-group"
            />

            <VirtualStudiesMenuButton
              label={'Save as'}
              tooltipText={'Saves the current virtual study as a new one'}
              icon={<FileOutlined />}
              disabled={cantSaveAs}
              onClick={this.onSaveAsClick}
              className="button-group"
            />

            <VirtualStudiesMenuButton
              label={'delete'}
              tooltipText={'Delete this virtual study'}
              icon={<DeleteOutlined />}
              disabled={cantDelete}
              onClick={this.onDeleteClick}
              className="button-group"
            />

            {cantShare ? (
              <ShareQuery
                disabled
                getSharableUrl={this.getSharableUrl}
                handleShare={() => Promise.resolve({ id: activeVirtualStudyId })}
                user={user}
              />
            ) : (
              <Tooltip title={<div>Share this virtual study</div>} className="button-group">
                <div>
                  <ShareQuery
                    disabled={false}
                    getSharableUrl={this.getSharableUrl}
                    handleShare={() => Promise.resolve({ id: activeVirtualStudyId })}
                    user={user}
                  />
                </div>
              </Tooltip>
            )}
          </Row>
        </Row>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const { user, currentVirtualStudy, virtualStudies, modal } = state;
  return {
    uid: user.uid,
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
    openModalId: modal.id,
    user: selectUser(state),
  };
};

const mapDispatchToProps = {
  fetchVirtualStudiesCollection,
  resetVirtualStudy,
  loadSavedVirtualStudy,
  saveVirtualStudy,
  openModal: (id) => (dispatch) => dispatch(openModal(id)),
  closeModal: (id) => (dispatch) => dispatch(closeModal(id)),
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
)(VirtualStudiesMenu);
