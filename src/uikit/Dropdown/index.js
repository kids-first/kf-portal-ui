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
  OptionsContainerComponent = DropdownOptionsContainer,
  onToggle,
  ...rest
}) {
  return (
    <Downshift {...rest}>
      {({ getItemProps, getRootProps, toggleMenu, isOpen }) => {
        return (
          <ContainerComponent
            className={className}
            {...getRootProps({ refKey: 'innerRef' }, { suppressRefError: true })}
          >
            <DropdownLabelContainer onClick={onToggle || toggleMenu}>
              {children}
              <DropDownImage alt="" isOpen={isOpen} src={downChevronIcon} />
            </DropdownLabelContainer>
            {!isOpen ? null : (
              <OptionsContainerComponent align={align}>
                {items.map((item, i) => (
                  <ItemWrapperComponent {...getItemProps({ item })} key={i}>
                    {item}
                  </ItemWrapperComponent>
                ))}
              </OptionsContainerComponent>
            )}
          </ContainerComponent>
        );
      }}
    </Downshift>
  );
}

export { DropdownContainer, DropdownOptionsContainer } from './ui';
export default Dropdown;
