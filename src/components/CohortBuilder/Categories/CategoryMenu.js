import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'auto-bind-es5';
import RightIcon from 'react-icons/lib/fa/angle-right';
import { Menu } from 'antd';

import { sqonShape } from 'shapes';
import Row from 'uikit/Row';
import CheckmarkIcon from 'icons/CheckmarkIcon';

import '../CohortBuilder.css';

export default class CategoryMenu extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  static propTypes = {
    fields: PropTypes.arrayOf(PropTypes.string).isRequired,
    sqon: sqonShape.isRequired,
    extendedMapping: PropTypes.arrayOf(PropTypes.any),
    onMenuItemSelected: PropTypes.func.isRequired,
  };

  getFieldDisplayName(fieldName) {
    const { extendedMapping } = this.props;
    return extendedMapping.find(mapping => mapping.field === fieldName).displayName || fieldName;
  }

  getMenuItem(field) {
    const { sqon } = this.props;
    const isFieldInSqon = fieldId =>
      sqon.content.some(({ content: { field } }) => field === fieldId);
    const fieldIsInSqon = isFieldInSqon(field);

    return (
      <Menu.Item className="cb-category-menuItem" key={field}>
        <Row>
          {fieldIsInSqon ? <CheckmarkIcon style={{ marginRight: '5px' }} /> : null}
          {this.getFieldDisplayName(field)}
        </Row>
        <RightIcon />
      </Menu.Item>
    );
  }

  handleMenuClicked({ key }) {
    this.props.onMenuItemSelected(key);
  }

  render() {
    const { fields } = this.props;
    return (
      <Menu selectable={false} multiple={false} onClick={this.handleMenuClicked}>
        {fields.flatMap((field, index) => {
          const menuItem = this.getMenuItem(field);
          const last = index === fields.length - 1;
          return last ? menuItem : [menuItem, <Menu.Divider key={`divider_${field}`} />];
        })}
      </Menu>
    );
  }
}
