import React from 'react';
import Modal from 'react-modal';
import { injectState } from 'freactal';
import CloseIcon from 'react-icons/lib/md/close';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';
import { getAppElement } from '../../services/globalDomNodes.js';
import LoadingOnClick from 'components/LoadingOnClick';
import ErrorIcon from 'icons/ErrorIcon';
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
  <div
    css={`
      ${theme.row} justify-content: space-between;
      border-bottom: 1px solid #d4d6dd;
      margin-bottom: 1.5em;
    `}
  >
    <span css={theme.modalTitle}>{title}</span>
    <CloseIcon
      css="cursor:pointer; width:22px; height:22px; margin-top:-10px; margin-right:-10px;"
      fill="black"
      onClick={() => unsetModal()}
    />
  </div>
);

export const ModalSubHeader = withTheme(({ theme, children, ...props }) => (
  <div
    className={css`
      ${theme.modalHeader};
      margin-bottom: 9px;
    `}
    {...props}
  >
    {children}
  </div>
));

export const ModalWarning = enhance(({ theme, content, ...props }) => {
  return (
    <div
      css={`
        display: flex;
        flex-direction: row;
        align-items: left;
        background-color: #f9dee1;
        border-radius: 7px;
        border-style: solid;
        border-color: #e45562;
        border-width: 1px;
        padding: 10px;
        margin-bottom: 1em;
      `}
    >
      <div
        css={`
          padding-right: 10px;
        `}
      >
        <ErrorIcon width={30} height={30} fill={`#e45562`} />
      </div>
      <div
        css={`
          padding-top: 2px;
          line-height: 1.6em;
        `}
      >
        {props.children}
      </div>
    </div>
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
      <div
        className={css`
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
        <div
          className={css`
            display: flex;
            align-items: center;
            justify-content: center;
          `}
        >
          {children}
        </div>
        {showSubmit && (
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
        )}
      </div>
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
    className={`${css`
      top: 50%;
      left: 50%;
      right: auto;
      bottom: auto;
      position: relative;
      border: 1px solid rgb(204, 204, 204);
      background: rgb(255, 255, 255);
      border-radius: 4px;
      transform: translate(-50%, -50%);
      width: 95%;
      box-sizing: border-box;
      padding: 20px 20px;
      max-width: 1000px;
      box-shadow: rgba(0, 0, 0, 0.5) 0px 5px 15px;
      overflow: visible;
      ${isFooterShown ? 'padding-bottom: 75px;' : ''};
    `} ${classNames ? classNames.content : ''}`}
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
