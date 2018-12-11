import React from 'react';
import Downshift from 'downshift';

import { DropdownHeader, ToolbarButton, DropdownContent } from './styles';

function ArrowIcon({ isOpen }) {
  return (
    <svg
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
      width={16}
      fill="transparent"
      stroke="#979797"
      strokeWidth="1.1px"
      transform={isOpen ? 'rotate(180)' : null}
    >
      <path d="M1,6 L10,15 L19,6" />
    </svg>
  );
}
const ColumnFilter = ({ onChange, columns, children }) => {
  console.log('col filter', columns);
  return (
    <Downshift
      itemToString={item => item.Header}
      aria-label={`Select columns`}
      onChange={onChange}
      selectedItem={columns.filter(col => col.show)}
    >
      {({ getButtonProps, getItemProps, isOpen, selectedItem }) => (
        <div>
          <DropdownHeader>
            <ToolbarButton
              aria-label={`Show columns to select`}
              {...getButtonProps({ onClick: this.handleToggleMenu })}
            >
              {children}
              <ArrowIcon isOpen={isOpen} />
            </ToolbarButton>
            {!isOpen ? null : (
              <DropdownContent>
                {columns.map((item, index) => (
                  <div
                    className="dropDownContentElement"
                    key={item.index}
                    {...getItemProps({ item, index })}
                  >
                    {item.Header}
                    <input
                      readOnly
                      type="checkbox"
                      checked={selectedItem.indexOf(item) > -1}
                      aria-label={`Select column ${item.Header}`}
                    />
                  </div>
                ))}
              </DropdownContent>
            )}
          </DropdownHeader>
        </div>
      )}
    </Downshift>
  );
};
export default ColumnFilter;
