import React from 'react';
// [NEXT] 'react-modal' should be replaced by antd equivalent
import ReactModal from 'react-modal';

import { ActionButton } from 'uikit/Button';
import Column from 'uikit/Column';
import { H2 } from 'uikit/Headings';

import {
  modalFooterContainer,
  modalFooterContent,
  modalActionButton,
  // modalCancelButton,
  modal,
  modalContent,
  modalSubHeader,
  // modalTitle,
} from './Modal.module.css';

export const ModalFooterContainer = ({ children }) => (
  <div className={`${modalFooterContainer} bg-greyScale10`}>{children}</div>
);

export const ModalFooterContent = ({ children }) => (
  <div className={modalFooterContent}>{children}</div>
);

export const ModalActionButton = ({ children }) => (
  <ActionButton className={modalActionButton}>{children}</ActionButton>
);

// export const CancelButton = ({ children }) => (
//   <ModalActionButton className={`${modalCancelButton} color-tertiary`}>
//     {children}
//   </ModalActionButton>
// );

export const Modal = ({ children, className, isFooterShown, style = {}, ...props }) => (
  <ReactModal
    className={`${modal} ${className}`}
    {...props}
    style={{
      content: {
        paddingBottom: isFooterShown ? '75px' : '',
        ...style,
      },
    }}
  >
    {children}
  </ReactModal>
);

export const ModalContent = ({ children }) => <Column className={modalContent}>{children}</Column>;

export const ModalSubHeader = ({ children }) => <div className={modalSubHeader}>{children}</div>;

export const ModalTitle = ({ children }) => <H2 className={modalSubHeader}>{children}</H2>;
