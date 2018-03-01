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
    {title}
    <CloseIcon onClick={() => unsetModal()} />
  </h2>
);

const ModalFooter = ({ theme, setModal, unsetModal, ...props }) => (
  <div
    css={`
      ${theme.row} background-color: #edeef1;
      border-radius: 5px;
      padding: 1em;
      margin-top: 1em;
      justify-content: space-between;
    `}
  >
    <button css={theme.wizardButton} onClick={() => unsetModal()}>
      Cancel
    </button>
    <button css={theme.actionButton} onClick={props.handleSubmit}>
      Save
    </button>
  </div>
);

const ModalView = ({ theme, children, title, setModal, unsetModal, ...props }) => (
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
        position: 'initial',
        border: '1px solid rgb(204, 204, 204)',
        background: 'rgb(255, 255, 255)',
        borderRadius: '4px',
        margin: '30px auto',
        width: '55%',
        boxShadow: 'rgba(0, 0, 0, 0.5) 0px 5px 15px',
        overflow: 'visible',
      },
    }}
    {...props}
  >
    <ModalHeader {...{ theme, title, unsetModal, ...props }} />
    {children}
    <ModalFooter {...{ theme, setModal, unsetModal, ...props }} />
  </Modal>
);

export default enhance(ModalView);
