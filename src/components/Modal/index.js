import React from 'react';
import Modal from 'react-modal';
import { injectState } from 'freactal';
import CloseIcon from 'react-icons/lib/md/close';
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
  <div className={`${theme.row} modalHeader`}>
    <span css={theme.modalTitle}>{title}</span>
    <CloseIcon
      css="cursor:pointer; width:22px; height:22px; margin-top:-10px; margin-right:-10px;"
      fill="black"
      onClick={() => unsetModal()}
    />
  </div>
);

export const ModalSubHeader = withTheme(({ theme, children, ...props }) => (
  <div className={`${theme.modalHeader}`} {...props}>
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
      <div className={`${theme.row} modalFooter`}>
        <button css={theme.wizardButton} onClick={() => handleCancelClick()}>
          {cancelText}
        </button>
        <div className={`footerContent`}>{children}</div>
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
    overlayClassName={`${theme.modalOverlay} ${classNames ? classNames.overlay : ''}`}
    className={`${theme.modal} ${isFooterShown ? 'withFooter' : ''} ${
      classNames ? classNames.modal : ''
    }`}
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
        flex: 1;
      `}
    >
      {component}
    </div>
  </Modal>
);

export default enhance(ModalView);
