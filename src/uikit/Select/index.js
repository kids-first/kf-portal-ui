import React from 'react';
import Downshift from 'downshift';
import { css } from 'emotion';
import { truncate } from 'lodash';

import downChevronIcon from '../../assets/icon-chevron-down-grey.svg';
import { OptionDropdownWrapper, DropDownToggler, ToggleImage, StyledDropDownOption } from './ui';

export const optionDropdownWrapperClassName = css``;

export const DropDownOption = ({
  item,
  itemClassName,
  isItemDisabled,
  onToggle,
  selectItem,
  onDisabledItemClick,
  getItemProps,
}) => (
  <StyledDropDownOption
    key={item}
    itemClassName={itemClassName}
    disabled={isItemDisabled({ item })}
    {...getItemProps({ item })}
    {...(isItemDisabled({ item })
      ? {
          onClick: () => onDisabledItemClick({ item }),
        }
      : onToggle
        ? {
            onClick: () => {
              selectItem(item);
              onToggle();
            },
          }
        : {})}
  >
    {item}
  </StyledDropDownOption>
);

export const SelectOptionDropdown = ({
  align = 'right',
  itemContainerClassName = '',
  items = [],
  itemClassName = '',
  getItemProps,
  selectItem = () => {},
  onToggle,
  isItemDisabled = () => false,
  onDisabledItemClick = () => {},
  DropDownOptionComponent = DropDownOption,
}) => (
  <OptionDropdownWrapper align={align} className={itemContainerClassName}>
    {items.map(item => (
      <DropDownOptionComponent
        {...{
          key: item,
          item,
          itemClassName,
          isItemDisabled,
          onToggle,
          selectItem,
          onDisabledItemClick,
          getItemProps,
        }}
      />
    ))}
  </OptionDropdownWrapper>
);

function Select({
  items,
  className,
  itemClassName,
  itemContainerClassName,
  align = 'right',
  OptionDropdownComponent = SelectOptionDropdown,
  onToggle,
  selectedLabelTruncate = 0,
  ...rest
}) {
  return (
    <Downshift {...rest}>
      {({ getItemProps, isOpen, toggleMenu, selectedItem, ...rest }) => {
        return (
          <div
            css={`
              position: relative;
              white-space: nowrap;
              border-radius: 10px;
              background-color: #ffffff;
              border: solid 1px #cacbcf;
              color: #343434;
              font-size: 12px;
              box-sizing: border-box;
              display: flex;
              align-items: center;
              padding-left: 10px;
              ${className};
            `}
          >
            <DropDownToggler onClick={onToggle || toggleMenu}>
              {selectedLabelTruncate
                ? truncate(selectedItem, { length: selectedLabelTruncate })
                : selectedItem}
              <ToggleImage alt="" src={downChevronIcon} />
            </DropDownToggler>
            {!isOpen ? null : (
              <OptionDropdownComponent
                {...{
                  align,
                  itemContainerClassName,
                  items,
                  itemClassName,
                  getItemProps,
                  onToggle,
                }}
              />
            )}
          </div>
        );
      }}
    </Downshift>
  );
}

export default Select;
