import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown } from 'antd';
import autobind from 'auto-bind-es5';

import { DropdownArrowIcon } from 'uikit/Dropdown';

export default class HeaderMenu extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    menuItems: PropTypes.arrayOf(
      PropTypes.oneOf([
        PropTypes.element,
        PropTypes.shape({
          key: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        }),
      ]).isRequired,
    ).isRequired,
    onClick: PropTypes.func.isRequired,
    showArrow: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    showArrow: true,
  };

  constructor(props) {
    super(props);
    this.state = { isOpen: false };
    autobind(this);
  }

  setDropdownVisibility(isOpen) {
    this.setState({ isOpen });
  }

  render() {
    const { showArrow, onClick, className = '', menuItems, children = null } = this.props;
    const { isOpen } = this.state;

    const menu = (
      <Menu className="headerMenuMenuContainer" onClick={onClick}>
        {menuItems.map(item =>
          React.isValidElement(item) ? item : <Menu.Item key={item.key}>{item.label}</Menu.Item>,
        )}
      </Menu>
    );

    return (
      <Dropdown
        className={`headerMenuDropdown ${className}`}
        onVisibleChange={this.setDropdownVisibility}
        trigger={['click']}
        overlay={menu}
      >
        <div onClick={this.handleDropdownClick}>
          {children}
          {showArrow ? <DropdownArrowIcon isOpen={isOpen} /> : null}
        </div>
      </Dropdown>
    );
  }
}
