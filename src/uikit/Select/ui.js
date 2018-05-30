import styled from 'react-emotion';

export const OptionDropdownWrapper = styled('div')`
  position: absolute;
  background: white;
  min-width: 100%;
  z-index: 1;
  border: 1px solid ${({ theme }) => theme.borderGrey};
  box-sizing: border-box;
  cursor: pointer;
  padding: 5px;
  top: 100%;
  right: ${({ align }) => (align === 'right' ? `0` : `auto`)};
  left: ${({ align }) => (align === 'right' ? `auto` : `0`)};
`;

export const DropDownLabelContent = styled('div')`
  display: flex;
  cursor: pointer;
  flex-grow: 1;
  height: 100%;
  align-items: center;
  justify-content: space-between;
`;

export const ToggleImage = styled('img')`
  width: 9px;
  margin-right: 12px;
  margin-left: 10px;
  transform: rotate(${({ isOpen }) => (isOpen ? 180 : 0)}deg);
  transition: transform 0.2s;
`;

export const StyledDropDownOption = styled('div')`
  cursor: pointer;
  padding: 5px;
  color: ${({ disabled }) => (disabled ? 'lightgrey' : 'auto')};
`;
