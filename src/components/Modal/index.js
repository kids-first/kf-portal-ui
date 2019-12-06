import React from 'react';
import { injectState } from 'freactal';
import CloseIcon from 'react-icons/lib/md/close';
import { compose } from 'recompose';
import { getAppElement } from '../../services/globalDomNodes.js';
import LoadingOnClick from 'components/LoadingOnClick';
import Spinner from 'react-spinkit';
import { PromptMessageContainer, PromptMessageContent } from 'uikit/PromptMessage';

import { ModalFooterContainer, ModalFooterContent, Modal, ModalContent, ModalTitle } from './ui';
import { WhiteButton, TealActionButton } from '../../uikit/Button.js';

import styles from './Modal.module.css';

const enhance = compose(injectState);

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

const ModalHeader = ({ title, unsetModal }) => (
  <div className={`${styles.modalHeader}`}>
    <ModalTitle>{title}</ModalTitle>
    <CloseIcon
      style={{
        cursor: 'pointer',
        width: '22px',
        height: '22px',
        marginTop: '-10px',
        marginRight: '-10px',
      }}
      fill="black"
      onClick={() => unsetModal()}
    />
  </div>
);

export const ModalWarning = enhance(({ children }) => {
  return (
    <PromptMessageContainer error>
      <PromptMessageContent>{children}</PromptMessageContent>
    </PromptMessageContainer>
  );
});

export const ModalFooter = enhance(
  ({
    effects: { setModal, unsetModal },
    showSubmit = true,
    submitText = 'Save',
    cancelText = 'Cancel',
    submitLoadingContent = defaultLoadingContent,
    handleSubmit,
    handleCancelClick = unsetModal,
    submitDisabled = false,
    children,
  }) => {
    return (
      <ModalFooterContainer>
        <WhiteButton onClick={() => handleCancelClick()}>{cancelText}</WhiteButton>
        <ModalFooterContent>{children}</ModalFooterContent>
        {showSubmit && (
          <LoadingOnClick
            onClick={handleSubmit}
            submitDisabled={submitDisabled}
            readyContent={submitText}
            loadingContent={submitLoadingContent}
            render={({ onClick, loading, readyContent, loadingContent, submitDisabled }) => (
              <TealActionButton disabled={submitDisabled} onClick={onClick}>
                {loading && loadingContent}
                {readyContent}
              </TealActionButton>
            )}
          />
        )}
      </ModalFooterContainer>
    );
  },
);

const ModalView = ({
  isFooterShown = true,
  effects: { setModal, unsetModal },
  state: {
    modalState: { component, title, classNames, style },
  },
  ...props
}) => (
  <Modal
    isFooterShown={isFooterShown}
    className={`${classNames ? classNames.modal : ''}`}
    style={style || {}}
    overlayClassName={`${classNames ? classNames.overlay : ''} ${styles.modalOverlay}`}
    {...{
      appElement: getAppElement(),
      isOpen: !!component,
      ...props,
    }}
  >
    {!!title ? <ModalHeader {...{ title, unsetModal, ...props }} /> : null}
    <ModalContent className={`${classNames ? classNames.content : ''}`}>{component}</ModalContent>
  </Modal>
);

export default compose(injectState)(ModalView);
export { ModalActionButton } from './ui';
export { ModalSubHeader } from './ui';
