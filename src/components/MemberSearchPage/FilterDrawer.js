import React, { Component } from 'react';
import './MemberSearchPage.css';
import { Icon, Layout, Typography } from 'antd';
import RolesFilter from 'components/MemberSearchPage/RolesFilter';
import InterestsFilter from 'components/MemberSearchPage/InterestsFilter';
import AllMembersFilter from './AllMembersFilter';

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
    const { collapsed } = this.state;
    return (
      <Sider
        trigger={null}
        width={314}
        collapsedWidth={37}
        collapsible
        collapsed={this.state.collapsed}
        style={{ boxShadow: '0 0 4.9px 0.2px rgba(0,0,0,0.5)' }}
      >
        <div style={{ height: 50, display: 'flex', padding: '15px 7px 15px 12px' }}>
          <Title
            level={3}
            style={{
              display: collapsed ? 'none' : 'block',
            }}
          >
            Filters
          </Title>
          <Icon
            style={{ width: '100%', textAlign: 'end', fontSize: 20, color: 'rgb(43, 56, 143)' }}
            type={collapsed ? 'double-right' : 'double-left'}
            onClick={this.onCollapse}
          />
        </div>
        <RolesFilter collapsed={collapsed} />
        <InterestsFilter collapsed={collapsed} />
        {this.props.isAdmin ? <AllMembersFilter collapsed={collapsed} /> : ''}
      </Sider>
    );
  }
}

export default FilterDrawer;
