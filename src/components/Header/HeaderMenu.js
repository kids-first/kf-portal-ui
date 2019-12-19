import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown } from 'antd';
import autobind from 'auto-bind-es5';
import noop from 'lodash/noop';

import { DropdownArrowIcon } from 'uikit/Dropdown';

export default class HeaderMenu extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    menuItems: PropTypes.arrayOf(PropTypes.element).isRequired,
    onClick: PropTypes.func,
    showArrow: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    showArrow: true,
    onClick: noop,
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
      <Menu
        className="headerMenuMenuContainer"
        defaultActiveFirst={true} // have the appearance of the first item as if it was hovered
        onClick={onClick}
      >
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
        {/*eslint-disable-next-line*/}
        <a onClick={this.handleDropdownClick} href="#">
          {children}
          {showArrow ? <DropdownArrowIcon isOpen={isOpen} /> : null}
        </a>
      </Dropdown>
    );
  }
}
