import React from 'react';
// [NEXT] 'react-modal' should be replaced by antd equivalent
import ReactModal from 'react-modal';

import { ActionButton } from 'uikit/Button';
import Column from 'uikit/Column';
import { Typography } from 'antd';

import {
  modalFooterContainer,
  modalFooterContent,
  modalActionButton,
  modal,
  modalContent,
  modalSubHeader,
} from './Modal.module.css';

const { Title } = Typography;

export const ModalFooterContainer = ({ children }) => (
  <div className={`${modalFooterContainer} bg-greyScale10`}>{children}</div>
);

export const ModalFooterContent = ({ children }) => (
  <div className={modalFooterContent}>{children}</div>
);

export const ModalActionButton = ({ children }) => (
  <ActionButton className={modalActionButton}>{children}</ActionButton>
);

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

export const ModalTitle = ({ children }) => <Title level={3}>{children}</Title>;
