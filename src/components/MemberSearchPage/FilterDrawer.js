import React, { useState } from 'react';
import './MemberSearchPage.css';
import PropTypes from 'prop-types';
import { Button, Layout, Typography } from 'antd';
import RolesFilter from 'components/MemberSearchPage/RolesFilter';
import InterestsFilter from 'components/MemberSearchPage/InterestsFilter';
import AllMembersFilter from './AdminFilter';
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons';

const { Sider } = Layout;
const { Title } = Typography;

const FilterDrawer = ({ isAdmin }) => {
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sider trigger={null} width={314} collapsedWidth={37} collapsible collapsed={collapsed}>
      <div style={{ height: 50, display: 'flex', padding: '15px 7px 15px 12px' }}>
        <Title
          level={3}
          style={{
            display: collapsed ? 'none' : 'block',
          }}
        >
          Filters
        </Title>
        <Button
          style={{ width: '100%', textAlign: 'end', fontSize: 20, color: 'rgb(43, 56, 143)' }}
          type="link"
          icon={collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
          onClick={onCollapse}
        />
      </div>
      <div>
        <RolesFilter collapsed={collapsed} />
        <InterestsFilter collapsed={collapsed} />
        {isAdmin ? <AllMembersFilter collapsed={collapsed} /> : ''}
      </div>
    </Sider>
  );
};

FilterDrawer.propTypes = {
  isAdmin: PropTypes.bool,
};

export default FilterDrawer;
