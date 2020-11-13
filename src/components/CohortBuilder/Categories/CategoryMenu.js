import React from 'react';
import PropTypes from 'prop-types';
import RightIcon from 'react-icons/lib/fa/angle-right';
import { Menu } from 'antd';
import { sqonShape } from 'shapes';
import CheckmarkIcon from 'icons/CheckmarkIcon';
import { extendedMappingShape } from 'shapes';
import { getFieldDisplayName } from 'utils';

import '../CohortBuilder.css';

const isFieldInSqon = (fieldId, sqon) =>
  sqon.content.some(({ content: { field } }) => field === fieldId);

export default class CategoryMenu extends React.Component {
  static propTypes = {
    fields: PropTypes.arrayOf(PropTypes.string).isRequired,
    sqon: sqonShape.isRequired,
    extendedMapping: extendedMappingShape,
    onMenuItemSelected: PropTypes.func.isRequired,
  };

  generateMenuItem = (field) => {
    const { sqon, extendedMapping } = this.props;

    const fieldIsInSqon = isFieldInSqon(field, sqon);

    return (
      <Menu.Item className="cb-category-menuItem" key={field}>
        <div className={'menu-item-container'}>
          <div>
            {fieldIsInSqon && <CheckmarkIcon className={'check-mark-icon'} />}
            {getFieldDisplayName(field, extendedMapping)}
          </div>
          <div className="cb-category-menuItem-icon-rightArrow">
            <RightIcon />
          </div>
        </div>
      </Menu.Item>
    );
  };

  handleMenuClicked = ({ key }) => this.props.onMenuItemSelected(key);

  generateMenuItems = () => {
    const { fields } = this.props;
    return fields.flatMap((field, index) => {
      const menuItem = this.generateMenuItem(field);
      const last = index === fields.length - 1;
      return last ? menuItem : [menuItem, <Menu.Divider key={`divider_${field}`} />];
    });
  };

  render() {
    return (
      <Menu selectable={false} multiple={false} onClick={this.handleMenuClicked}>
        {this.generateMenuItems()}
      </Menu>
    );
  }
}
