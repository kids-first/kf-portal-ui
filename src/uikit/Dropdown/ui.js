import styled from 'react-emotion';
import Column from '../Column';
import Row from '../Row';
import ChevronIcon from '../../icons/ChevronIcon';

export const DropdownContainer = styled(Row)`
  position: relative;
  white-space: nowrap;
  z-index: auto;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.white};
  border: solid 1px ${({ theme }) => theme.borderGrey};
  color: ${({ theme }) => theme.greyScale1};
  font-size: 12px;
  align-items: center;
  padding-left: 10px;
`;

export const ItemWrapper = styled('div')`
  cursor: pointer;
  padding: 10px;
`;

export const DropdownLabelContainer = styled(Row)`
  cursor: pointer;
  flex-grow: 1;
  height: 100%;
  align-items: center;
  justify-content: space-between;
`;

export const DropdownOptionsContainer = styled(Column)`
  position: absolute;
  background: ${({ theme }) => theme.white};
  min-width: 100%;
  z-index: 200;
  cursor: pointer;
  padding: 5;
  right: ${({ align }) => (align === 'right' ? '25px' : 'auto')};
  left: ${({ align }) => (align === 'left' ? 'auto' : '-25px')};
  top: 100%;
  box-shadow: 0 0 4.9px 0.1px ${({ theme }) => theme.shadow};
  border-radius: 2px;

  ${({ hideTip }) =>
    hideTip
      ? ''
      : ` &:after, &:before {
      bottom: 100%;
      left: 50%;
      border: solid transparent;
      content: ' ';
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
    }
  `} &:after {
    border-color: rgba(255, 255, 255, 0);
    border-bottom-color: ${({ theme }) => theme.white};
    border-width: 6px;
    margin-left: -6px;
  }
  &:before {
    border-color: rgba(0, 0, 0, 0);
    border-bottom-color: ${({ theme }) => theme.borderGrey};
    border-width: 7px;
    margin-left: -7px;
  }
`;

export const DropdownArrowIcon = styled(ChevronIcon)`
  color: ${({ theme }) => theme.primary};
  width: 9px;
  margin-left: 7px;
  margin-right: 12px;
  transform: rotate(${({ isOpen }) => (isOpen ? 180 : 0)}deg);
  transition: transform 0.2s;
  fill: ${({ isOpen, theme }) => (isOpen ? theme.hover : theme.primary)};

  &:hover {
    fill: '#e83a9c';
  }
`;

export const DropdownExpandedContainer = styled('div')``;
