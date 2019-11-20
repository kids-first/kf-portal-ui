import React, { Component } from 'react';
import './MemberSearchPage.css';
import { Icon, Layout, Typography } from 'antd';
import { withTheme } from 'emotion-theming';
import RolesFilter from 'components/MemberSearchPage/RolesFilter';
import InterestsFilter from 'components/MemberSearchPage/InterestsFilter';

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
        width={300}
        collapsible
        collapsed={this.state.collapsed}
        style={{ boxShadow: '2px 2px 3px 1px #888888' }}
      >
        <div style={{ height: 50, display: 'flex', padding: '15px 7px 15px 12px' }}>
          <Title
            level={2}
            className={'h2-title'}
            style={{
              fontFamily: 'Montserrat,sans-serif',
              color: '#2b388f',
              fontWeight: 500,
              margin: 0,
              padding: 0,
              fontSize: 18,
              display: this.state.collapsed ? 'none' : 'block',
            }}
          >
            Filters
          </Title>
          <Icon
            style={{ width: '100%', textAlign: 'end', fontSize: 20, color: 'rgb(43, 56, 143)' }}
            type={this.state.collapsed ? 'double-right' : 'double-left'}
            onClick={this.onCollapse}
          />
        </div>
        <RolesFilter collapsed={this.state.collapsed} />
        <InterestsFilter collapsed={this.state.collapsed} />
      </Sider>
    );
  }
}

const FilterDrawerWithTheme = withTheme(FilterDrawer);

export default FilterDrawerWithTheme;
