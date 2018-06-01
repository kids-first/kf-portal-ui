import React from 'react';
import Downshift from 'downshift';
import styled from 'react-emotion';
import Column from 'uikit/Column';
import Row from 'uikit/Row';

import downChevronIcon from '../assets/icon-chevron-down-grey.svg';

export const DropdownContainer = styled(Row)`
  position: relative;
  white-space: nowrap;
  z-index: 100;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.white};
  border: solid 1px ${({ theme }) => theme.borderGrey};
  color: ${({ theme }) => theme.greyScale1};
  font-size: 12px;
  align-items: center;
  padding-left: 10px;
`;

const ItemWrapper = styled('div')`
  cursor: pointer;
  padding: 10px;
`;

const DropdownLabelContainer = styled(Row)`
  cursor: pointer;
  flex-grow: 1;
  height: 100%;
  align-items: center;
  justify-content: space-between;
`;

const DropdownOptionsContainer = styled(Column)`
  position: absolute;
  background: ${({ theme }) => theme.white};
  min-width: 100%;
  z-index: 1;
  cursor: pointer;
  padding: 5,
  right: ${({ align }) => (align === 'right' ? 0 : 'auto')};
  left: ${({ align }) => (align === 'right' ? 'auto' : 0)};
  top: 100%;
  box-shadow: 0 0 4.9px 0.1px ${({ theme }) => theme.shadow};
  border-radius: 2px;

  &:after, &:before {
    bottom: 100%;
    left: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }

  &:after {
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

const DropDownImage = styled('img')`
  width: 9px;
  margin-left: 7px;
  margin-right: 12px;
  transform: rotate(${({ isOpen }) => (isOpen ? 180 : 0)}deg);
  transition: transform 0.2s;
`;

function Dropdown({
  items,
  className,
  children,
  align = 'right',
  ItemWrapperComponent = ItemWrapper,
  ContainerComponent = DropdownContainer,
  ...rest
}) {
  return (
    <Downshift {...rest}>
      {({ getItemProps, getRootProps, isOpen, toggleMenu, itemToString, selectedItem }) => (
        <ContainerComponent
          className={className}
          {...getRootProps({ refKey: 'ref' }, { suppressRefError: true })}
        >
          <DropdownLabelContainer onClick={toggleMenu}>
            {children}
            <DropDownImage alt="" isOpen={isOpen} src={downChevronIcon} />
          </DropdownLabelContainer>
          {!isOpen ? null : (
            <DropdownOptionsContainer align={align}>
              {items.map((item, i) => (
                <ItemWrapperComponent {...getItemProps({ item })} key={i}>
                  {item}
                </ItemWrapperComponent>
              ))}
            </DropdownOptionsContainer>
          )}
        </ContainerComponent>
      )}
    </Downshift>
  );
}

export default Dropdown;
