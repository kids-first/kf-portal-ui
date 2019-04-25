import React from 'react';
import { injectState } from 'freactal';
import CloseIcon from 'react-icons/lib/md/close';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';
import { getAppElement } from '../../services/globalDomNodes.js';
import LoadingOnClick from 'components/LoadingOnClick';
import Spinner from 'react-spinkit';
import { PromptMessageContainer, PromptMessageContent } from 'uikit/PromptMessage';

import { ModalFooterContainer, ModalFooterContent, Modal, ModalContent, ModalTitle } from './ui';
import { WhiteButton, TealActionButton } from '../../uikit/Button.js';

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
  <div
    css={`
      ${theme.row} justify-content: space-between;
      border-bottom: 1px solid #d4d6dd;
      margin-bottom: 1.5em;
    `}
  >
    <ModalTitle>{title}</ModalTitle>
    <CloseIcon
      css="cursor:pointer; width:22px; height:22px; margin-top:-10px; margin-right:-10px;"
      fill="black"
      onClick={() => unsetModal()}
    />
  </div>
);

export const ModalWarning = enhance(({ theme, content, ...props }) => {
  return (
    <PromptMessageContainer error>
      <PromptMessageContent>{props.children}</PromptMessageContent>
    </PromptMessageContainer>
  );
});

export const ModalFooter = enhance(
  ({
    theme,
    effects: { setModal, unsetModal },
    showSubmit = true,
    submitText = 'Save',
    cancelText = 'Cancel',
    submitLoadingContent = defaultLoadingContent,
    handleSubmit,
    handleCancelClick = unsetModal,
    submitDisabled = false,
    children,
    ...props
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
  theme,
  effects: { setModal, unsetModal },
  state: { modalState: { component, title, classNames } },
  ...props
}) => (
  <Modal
    isFooterShown={isFooterShown}
    className={`${classNames ? classNames.modal : ''}`}
    overlayClassName={`${css`
      position: fixed;
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
      background-color: rgba(0, 0, 0, 0.5);
      display: block;
      z-index: 1000;
    `} ${classNames ? classNames.overlay : ''}`}
    {...{
      appElement: getAppElement(),
      isOpen: !!component,
      ...props,
    }}
  >
    {!!title ? <ModalHeader {...{ theme, title, unsetModal, ...props }} /> : null}
    <ModalContent className={`${classNames ? classNames.content : ''}`}>{component}</ModalContent>
  </Modal>
);

export default enhance(ModalView);
export { ModalActionButton } from './ui';
export { ModalSubHeader } from './ui';
