import React from 'react';
import Downshift from 'downshift';
import { compose, withState, withHandlers } from 'recompose';

import {
  DropdownContainer,
  ItemWrapper,
  DropdownLabelContainer,
  DropdownOptionsContainer,
  DropdownArrowIcon,
  DropdownExpandedContainer,
} from './ui';

const Dropdown = ({
  items,
  className,
  children,
  align = 'right',
  showArrow = true,
  multiLevel = false,
  expandedItems,
  showExpanded,
  showExpandedItem,
  setExpanded,
  ItemWrapperComponent = ItemWrapper,
  ContainerComponent = DropdownContainer,
  OptionsContainerComponent = DropdownOptionsContainer,
  DropdownArrow = DropdownArrowIcon,
  LabelContainer = DropdownLabelContainer,
  ItemExpandedWrapperComponent = DropdownExpandedContainer,
  onToggle = x => x,
  setActiveIndex,
  activeIndex,
  ...rest
}) => (
  <Downshift {...rest}>
    {({ getItemProps, getRootProps, getLabelProps, toggleMenu, isOpen }) => {
      return (
        <ContainerComponent {...getRootProps({ refKey: 'innerRef' }, { suppressRefError: true })}>
          <LabelContainer
            {...getLabelProps({
              isOpen,
              onClick: () => (onToggle ? onToggle() : toggleMenu()),
            })}
          >
            {children}
            {showArrow ? <DropdownArrow isOpen={isOpen} /> : null}
          </LabelContainer>
          {!isOpen ? null : (
            <OptionsContainerComponent align={align}>
              {showExpanded && multiLevel ? (
                <ItemExpandedWrapperComponent>
                  {expandedItems[activeIndex]}
                </ItemExpandedWrapperComponent>
              ) : (
                items.map((item, i) => (
                  <ItemWrapperComponent
                    {...getItemProps({
                      item,
                      key: i,
                    })}
                    onClick={() => {
                      showExpandedItem( getItemProps({item, key: i}) )
                      if (multiLevel) {
                        setActiveIndex(i);
                        setExpanded(!showExpanded);
                      } else {
                        toggleMenu();
                      }
                    }}
                  >
                    {item}
                  </ItemWrapperComponent>
                ))
              )}
            </OptionsContainerComponent>
          )}
        </ContainerComponent>
      );
    }}
  </Downshift>
);

export {
  DropdownContainer,
  ItemWrapper,
  DropdownLabelContainer,
  DropdownOptionsContainer,
  DropdownArrowIcon,
};

export const withDropdownState = compose(
  withState('isDropdownVisible', 'setDropdownVisibility', false),
  withHandlers({
    toggleDropdown: ({ isDropdownVisible, setDropdownVisibility }) => e => {
      setDropdownVisibility(!isDropdownVisible);
    },
  }),
);

export const withDropdownMultiPane = compose(
  withState('showExpanded', 'setExpanded', false),
  withState('activeIndex', 'setActiveIndex', null),
  withHandlers({
    toggleExpanded: ({ showExpanded, setExpanded }) => e => {
      setExpanded(!showExpanded);
    },
    toggleExpandedDropdown: ({ showExpanded, setExpanded, toggleDropdown }) => e => {
      setExpanded(!showExpanded);
      toggleDropdown();
    },
  }),
);

export default Dropdown;
