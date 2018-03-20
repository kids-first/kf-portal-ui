import React from 'react';
import Modal from 'react-modal';
import { injectState } from 'freactal';
import CloseIcon from 'react-icons/lib/md/close';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';
import { getAppElement } from '../../services/globalDomNodes.js';
import LoadingOnClick from 'components/LoadingOnClick';
import Spinner from 'react-spinkit';

const enhance = compose(withTheme, injectState);

const defaultLoadingContent = (
  <Spinner
    fadeIn="none"
    name="circle"
    color="#fff"
    style={{
      width: 15,
      height: 15,
      marginRight: 9,
      display: 'inline-block',
    }}
  />
);

const ModalHeader = ({ theme, title, unsetModal, ...props }) => (
  <h2
    css={`
      ${theme.profileH2} ${theme.row} justify-content: space-between;
    `}
  >
    <span>{title}</span>
    <CloseIcon css="cursor:pointer;" onClick={() => unsetModal()} />
  </h2>
);

export const ModalFooter = enhance(
  ({
    theme,
    effects: { setModal, unsetModal },
    submitText = 'Save',
    cancelText = 'Cancel',
    submitLoadingContent = defaultLoadingContent,
    handleSubmit,
    handleCancelClick = unsetModal,
    submitDisabled = false,
    ...props
  }) => {
    return (
      <div
        css={`
          ${theme.row} background-color: #edeef1;
          border-radius: 5px;
          padding: 1em;
          margin-top: 1em;
          justify-content: space-between;
          position: absolute;
          left: 0px;
          right: 0px;
          bottom: 0px;
        `}
      >
        <button css={theme.wizardButton} onClick={() => handleCancelClick()}>
          {cancelText}
        </button>
        <LoadingOnClick
          onClick={handleSubmit}
          submitDisabled={submitDisabled}
          readyContent={submitText}
          loadingContent={submitLoadingContent}
          render={({ onClick, loading, readyContent, loadingContent, submitDisabled }) => (
            <button css={theme.actionButton} disabled={submitDisabled} onClick={onClick}>
              <span>
                {loading && loadingContent}
                {readyContent}
              </span>
            </button>
          )}
        />
      </div>
    );
  },
);

const ModalView = ({
  isFooterShown = true,
  theme,
  effects: { setModal, unsetModal },
  state: { modalState: { component, title } },
  ...props
}) => (
  <Modal
    style={{
      overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'block',
        zIndex: '1000',
      },
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        position: 'relative',
        border: '1px solid rgb(204, 204, 204)',
        background: 'rgb(255, 255, 255)',
        borderRadius: '4px',
        transform: 'translate(-50%, -50%)',
        width: '95%',
        boxSizing: 'border-box',
        maxWidth: 1000,
        boxShadow: 'rgba(0, 0, 0, 0.5) 0px 5px 15px',
        overflow: 'visible',
        ...(isFooterShown
          ? {
              paddingBottom: 75,
            }
          : {}),
      },
    }}
    {...{
      appElement: getAppElement(),
      isOpen: !!component,
      ...props,
    }}
  >
    {!!title ? <ModalHeader {...{ theme, title, unsetModal, ...props }} /> : null}
    <div
      css={`
        z-index: 1000;
      `}
    >
      {component}
    </div>
  </Modal>
);

export default enhance(ModalView);
