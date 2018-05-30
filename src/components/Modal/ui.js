import styled from 'react-emotion';
import { ActionButton } from 'uikit/Button';
import ReactModal from 'react-modal';

export const ModalFooterContainer = styled('div')`
  ${({ theme }) => theme.row} background-color: #edeef1;
  border-radius: 5px;
  padding: 1em;
  margin-top: 1em;
  justify-content: space-between;
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 0px;
  align-items: center;
`;

export const ModalFooterContent = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`;

export const ModalActionButton = styled(ActionButton)`
  font-size: 14px;
  height: auto;
`;

export const CancelButton = styled(ModalActionButton)`
  ${({ theme }) => theme.wizardButton};
  padding: 0px 16px;
  height: auto;
  text-transform: none;
`;

export const ModalWarningContainer = styled('div')`
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
`;

export const ModalWarningErrorWrapper = styled('div')`
  padding-right: 10px;
`;

export const ModalWarningErrorContent = styled('div')`
  padding-top: 2px;
  line-height: 1.6em;
`;

export const Modal = styled(ReactModal)`
  top: 50%;
  left: 50%;
  right: auto;
  bottom: auto;
  position: absolute;
  border: 1px solid rgb(204, 204, 204);
  background: rgb(255, 255, 255);
  border-radius: 4px;
  transform: translate(-50%, -50%);
  width: 95%;
  padding: 20px 20px;
  max-width: 1000px;
  max-height: 95%;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 5px 15px;
  overflow: visible;
  display: flex;
  flex-direction: column;
  padding-bottom: ${({ isFooterShown }) => (isFooterShown ? '75px' : '')};
`;

export const ModalContent = styled('div')`
  z-index: 1000;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const ModalSubHeader = styled('div')`
  ${({ theme }) => theme.modalHeader};
  margin-bottom: 9px;
`;
