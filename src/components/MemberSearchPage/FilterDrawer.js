import React, { Component } from 'react';
import { Checkbox, Divider, Icon, Layout, List, Row, Typography } from 'antd';
import { withTheme } from 'emotion-theming';
import { ROLES } from 'common/constants';

const { Sider } = Layout;
const { Title } = Typography;

const roleLookup = ROLES.reduce((acc, { type }) => ({ ...acc, [type]: false }), {});

class FilterDrawer extends Component {
  state = {
    collapsed: false,
    roleLookup,
  };

  onCollapse = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  onChange = type => e => {
    console.log('checked = ', e.target.checked);
    console.log(type);
    // this.setState({
    //   checked: e.target.checked,
    // });
  };

  render() {
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={this.state.collapsed}
        style={{ padding: 20, boxShadow: '2px 2px 3px 1px #888888' }}
      >
        <Icon
          style={{ float: 'right' }}
          type={this.state.collapsed ? 'double-right' : 'double-left'}
          onClick={this.onCollapse}
        />
        <div className={'member-list-container'} style={{ backgroundColor: 'white' }}>
          <Title
            level={2}
            style={{
              color: `${this.props.color ? this.props.color : this.props.theme.secondary}`,
              margin: 0,
              padding: 0,
              fontFamily: `${this.props.theme.fonts.default}`,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            Member Categories
          </Title>
          <Divider />
          <List
            itemLayout="horizontal"
            dataSource={ROLES}
            renderItem={role => {
              return (
                <List.Item key={role.type}>
                  <Row type="flex" justify="space-around" align="middle" gutter={10}>
                    <Checkbox
                        checked={this.state.checked}
                        onChange={this.onChange(role.type)}
                    >{role.displayName}</Checkbox>
                  </Row>
                </List.Item>
              );
            }}
          />
        </div>
      </Sider>
    );
  }
}
const FilterDrawerWithTheme = withTheme(FilterDrawer);

export default FilterDrawerWithTheme;
