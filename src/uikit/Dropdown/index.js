import React from 'react';
import Downshift from 'downshift';

import {
  DropdownContainer,
  ItemWrapper,
  DropdownLabelContainer,
  DropdownOptionsContainer,
  DropdownArrowIcon,
} from './ui';

function Dropdown({
  items,
  className,
  children,
  align = 'right',
  ItemWrapperComponent = ItemWrapper,
  ContainerComponent = DropdownContainer,
  OptionsContainerComponent = DropdownOptionsContainer,
  DropdownArrow = DropdownArrowIcon,
  LabelContainer = DropdownLabelContainer,
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
            <LabelContainer isOpen={isOpen} onClick={onToggle || toggleMenu}>
              {children}
              <DropdownArrow isOpen={isOpen} />
            </LabelContainer>
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
