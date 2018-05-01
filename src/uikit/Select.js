import React from 'react';
import Downshift from 'downshift';
import { css } from 'emotion';

import downChevronIcon from '../assets/icon-chevron-down-grey.svg';

export const optionDropdownWrapperClassName = css`
  position: absolute;
  background: white;
  min-width: 100%;
  z-index: 1;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  cursor: pointer;
  padding: 5px;
  top: 100%;
`;

const disabledDropdownOptionClassName = css`
  color: lightgrey;
`;

export const DropDownOption = ({
  item,
  itemClassName,
  isItemDisabled,
  onToggle,
  selectItem,
  onDisabledItemClick,
  getItemProps,
}) => (
  <div
    {...getItemProps({ item })}
    key={item}
    className={`
      ${css`
        cursor: pointer;
        padding: 5px;
      `}
      ${itemClassName}
      ${isItemDisabled({ item }) ? disabledDropdownOptionClassName : ''}`}
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
  </div>
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
  DropDownOptionComponent,
}) => (
  <div
    className={`
      ${optionDropdownWrapperClassName}
      ${css`
        right: ${align === 'right' ? `0` : `auto`};
        left: ${align === 'right' ? `auto` : `0`};
      `}
      ${itemContainerClassName};`}
  >
    {items.map(item => {
      const dropdownOptionProp = {
        item,
        itemClassName,
        isItemDisabled,
        onToggle,
        selectItem,
        onDisabledItemClick,
        getItemProps,
      };
      return DropDownOptionComponent ? (
        <DropDownOptionComponent {...dropdownOptionProp} />
      ) : (
        <DropDownOption {...dropdownOptionProp} />
      );
    })}
  </div>
);

function Select({
  items,
  className,
  itemClassName,
  itemContainerClassName,
  align = 'right',
  OptionDropdownComponent,
  onToggle,
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
            <div
              style={{
                display: 'flex',
                cursor: 'pointer',
                flexGrow: 1,
                height: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onClick={onToggle || toggleMenu}
            >
              {selectedItem}
              <img
                alt=""
                src={downChevronIcon}
                css={`
                  width: 9px;
                  margin-left: 7px;
                  margin-right: 12px;
                  transform: rotate(${isOpen ? 180 : 0}deg);
                  transition: transform 0.2s;
                `}
              />
            </div>
            {!isOpen ? null : OptionDropdownComponent ? (
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
            ) : (
              <SelectOptionDropdown
                {...{
                  ...{
                    align,
                    itemContainerClassName,
                    items,
                    itemClassName,
                    getItemProps,
                    onToggle,
                  },
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
