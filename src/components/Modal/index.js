import React from 'react';
import Modal from 'react-modal';
import { injectState } from 'freactal';
import CloseIcon from 'react-icons/lib/md/close';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';
import { getAppElement } from '../../services/globalDomNodes.js';

const enhance = compose(withTheme, injectState);

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
    handleSubmit,
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
        <button css={theme.wizardButton} onClick={() => unsetModal()}>
          {cancelText}
        </button>
        <button css={theme.actionButton} disabled={submitDisabled} onClick={handleSubmit}>
          {submitText}
        </button>
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
    {...{
      appElement: getAppElement(),
      isOpen: !!component,
      ...props,
    }}
  >
    {!!title ? <ModalHeader {...{ theme, title, unsetModal, ...props }} /> : null}
    <div
      css={`
        z-index: 111;
      `}
    >
      {component}
    </div>
  </Modal>
);

export default enhance(ModalView);
