import React from 'react';
import Downshift from 'downshift';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';

import downChevronIcon from '../assets/icon-chevron-down-grey.svg';

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

export const SelectOptionDropdown = compose(withTheme)(
  ({
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
    theme,
  }) => (
    <div
      className={`
      ${theme.optionDropdownWrapper}
      ${css`
        right: ${align === 'right' ? `0` : `auto`};
        left: ${align === 'right' ? `auto` : `0`};
      `}
      ${itemContainerClassName || ''};`}
    >
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
    </div>
  ),
);

function Select({
  items,
  className,
  itemClassName,
  itemContainerClassName,
  align = 'right',
  OptionDropdownComponent = SelectOptionDropdown,
  onToggle,
  theme,
  ...rest
}) {
  return (
    <Downshift {...rest}>
      {({ getItemProps, isOpen, toggleMenu, selectedItem, ...rest }) => {
        return (
          <div className={`${theme.select} ${className || ''}`}>
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

export default compose(withTheme)(Select);
