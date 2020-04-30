import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Menu, Dropdown, Checkbox } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const filterCols = cols => cols.filter(col => col.filterable !== false);

class ColumnFilter extends Component {
  static defaultProps = {
    columns: [],
    colsPickerBtnClassName: '',
  };

  static propTypes = {
    columns: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    defaultCols: PropTypes.array.isRequired,
    colsPickerBtnClassName: PropTypes.string,
  };

  state = {
    isOpen: false,
    checkedList: filterCols(this.props.defaultCols).map(i => i.Header),
  };

  onChangeCheckBox = e => {
    const { checkedList } = this.state;
    const { columns, onChange } = this.props;

    const itemValue = e.target.value;
    const isChecked = checkedList.includes(itemValue);

    const newCheckList = isChecked
      ? checkedList.filter(i => i !== itemValue)
      : [...checkedList, itemValue];

    const updatedCols = columns.map(c => (c.Header === itemValue ? { ...c, show: !isChecked } : c));
    const updatedCol = updatedCols.find(c => c.Header === itemValue);

    onChange(updatedCols, updatedCol);

    this.setState({ checkedList: newCheckList });
  };

  generateMenu = () => {
    const { columns } = this.props;
    const { checkedList } = this.state;

    return (
      <Menu>
        {filterCols(columns).map((item, index) => (
          <Menu.Item key={index}>
            <Checkbox
              onChange={this.onChangeCheckBox}
              checked={checkedList.includes(item.Header)}
              value={item.Header}
              aria-label={`Select column ${item.Header}`}
            >
              {item.Header}
            </Checkbox>
          </Menu.Item>
        ))}
      </Menu>
    );
  };
  render() {
    const { colsPickerBtnClassName } = this.props;
    return (
      <Dropdown overlay={this.generateMenu()} trigger={['click']}>
        <Button aria-label={`Show columns to select`} className={colsPickerBtnClassName}>
          Columns <DownOutlined />
        </Button>
      </Dropdown>
    );
  }
}

export default ColumnFilter;
