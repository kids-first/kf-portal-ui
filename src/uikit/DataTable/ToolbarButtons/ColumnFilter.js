import React from 'react';
import Downshift from 'downshift';

import { ToolbarItem, DropdownContent, ToolbarButton, ColumnIcon } from './styles';

const ColumnFilter = ({ onChange, columns, ...props }) => {
  const handleStateChange = changes => {
    const { isOpen, type } = changes;
    if (type === Downshift.stateChangeTypes.mouseUp) {
      this.setState({ isOpen });
    }
  };

  return (
    <Downshift
      itemToString={item => item.Header}
      aria-label={`Select columns`}
      onChange={onChange}
      selectedItem={columns.filter(col => col.show)}
      onStateChange={handleStateChange}
    >
      {({ getButtonProps, getItemProps, isOpen, selectedItem }) => (
        <div style={{ position: 'relative', whiteSpace: 'nowrap' }}>
          <ToolbarItem {...props}>
            <ToolbarButton
              aria-label={`Show columns to select`}
              {...getButtonProps({ onClick: this.handleToggleMenu })}
            >
              COLUMNS <ColumnIcon isOpen={isOpen} width="9px" height="9px" />
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
          </ToolbarItem>
        </div>
      )}
    </Downshift>
  );
};
export default ColumnFilter;
