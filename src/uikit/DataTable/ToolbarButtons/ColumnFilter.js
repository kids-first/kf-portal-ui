import React, { Component } from 'react';
import Downshift from 'downshift';
import { ToolbarItem, DropdownContent, ToolbarButton, ColumnIcon } from './styles';

class ColumnFilter extends Component {
  state = { isOpen: false };

  // keep dropdown open for multi select, close on click away
  handleStateChange = changes => {
    const { type, isOpen } = changes;
    if (typeof isOpen !== 'undefined' && type === Downshift.stateChangeTypes.clickButton) {
      this.setState({ isOpen });
    }
  };

  handleClose = () => {
    this.setState({ isOpen: false });
  };

  render() {
    const { onChange, columns, ...props } = this.props;
    return (
      <Downshift
        itemToString={item => item.Header}
        aria-label={`Select columns`}
        onChange={onChange}
        selectedItem={columns.filter(col => col.show)}
        onStateChange={this.handleStateChange}
        onOuterClick={this.handleClose}
        isOpen={this.state.isOpen}
      >
        {({ getButtonProps, getItemProps, isOpen, selectedItem }) => (
          <div style={{ position: 'relative', whiteSpace: 'nowrap' }}>
            <ToolbarItem {...props}>
              <ToolbarButton aria-label={`Show columns to select`} {...getButtonProps()}>
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
  }
}

export default ColumnFilter;
