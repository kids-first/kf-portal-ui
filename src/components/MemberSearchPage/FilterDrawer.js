import React, { Component } from 'react';
import { Checkbox, Divider, Icon, Layout, List, Row, Typography } from 'antd';
import { withTheme } from 'emotion-theming';
import { ROLES } from 'common/constants';

const { Sider } = Layout;
const { Title } = Typography;

class FilterDrawer extends Component {
  state = {
    collapsed: false,
  };

  onCollapse = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  render() {
    return (
      <Sider
        trigger={null}
        width={250}
        collapsible
        collapsed={this.state.collapsed}
        style={{ padding: 20, boxShadow: '2px 2px 3px 1px #888888' }}
      >
        <Icon
          style={{ float: 'right' }}
          type={this.state.collapsed ? 'double-right' : 'double-left'}
          onClick={this.onCollapse}
        />
        <div className={'member-list-container'} style={{ backgroundColor: 'white', display: this.state.collapsed ? 'none':'inline-block' }}>
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
            style={{ paddingLeft: 10 }}
            split={false}
            itemLayout="horizontal"
            dataSource={ROLES}
            renderItem={role => {
              return (
                <List.Item key={role.type}>
                  <Row type="flex" justify="space-around" align="middle" gutter={10}>
                    <Checkbox
                      checked={this.props.checkboxes[role.type]}
                      onChange={this.props.onChange(role.type)}
                    >
                      {role.displayName}
                    </Checkbox>
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
