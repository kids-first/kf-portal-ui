import React from 'react';
import Modal from 'react-modal';
import CloseIcon from 'react-icons/lib/md/close';
import { withTheme } from 'emotion-theming';
import { compose, withState } from 'recompose';

const enhance = compose(withTheme);

const ModalHeader = ({ theme, title, unsetModal, ...props }) => (
  <h2
    css={`
      ${theme.profileH2} ${theme.row} justify-content: space-between;
    `}
  >
    <span>{title}</span>
    <CloseIcon onClick={() => unsetModal()} />
  </h2>
);

export const ModalFooter = enhance(
  ({
    theme,
    setModal,
    unsetModal,
    submitText = 'Save',
    cancelText = 'Cancel',
    handleSubmit,
    ...props
  }) => (
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
      <button css={theme.wizardButton} onClick={() => unsetModal()}>
        {cancelText}
      </button>
      <button css={theme.actionButton} onClick={handleSubmit}>
        {submitText}
      </button>
    </div>
  ),
);

const ModalView = ({
  isFooterShown = true,
  theme,
  content,
  title,
  setModal,
  unsetModal,
  ...props
}) => (
  <Modal
    style={{
      overlay: {
        position: 'fixed',
        top: '0px',
        left: '0px',
        right: '0px',
        bottom: '0px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'block',
        zIndex: '111',
      },
      content: {
        position: 'relative',
        border: '1px solid rgb(204, 204, 204)',
        background: 'rgb(255, 255, 255)',
        borderRadius: '4px',
        margin: '30px auto',
        width: '55%',
        boxShadow: 'rgba(0, 0, 0, 0.5) 0px 5px 15px',
        overflow: 'visible',
        ...(isFooterShown
          ? {
              paddingBottom: 75,
            }
          : {}),
      },
    }}
    {...props}
  >
    {!!title ? <ModalHeader {...{ theme, title, unsetModal, ...props }} /> : null}
    {content}
  </Modal>
);

export default enhance(ModalView);
