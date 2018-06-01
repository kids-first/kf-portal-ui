import React from 'react';
import Downshift from 'downshift';

import downChevronIcon from '../../assets/icon-chevron-down-grey.svg';
import {
  DropdownContainer,
  ItemWrapper,
  DropdownLabelContainer,
  DropdownOptionsContainer,
  DropDownImage,
} from './ui';

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

export { DropdownContainer } from './ui';
export default Dropdown;
