/* eslint-disable react/display-name */
import React, { FC, useState } from 'react';

import { Layout } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import ScrollView from '@ferlab/ui/core/layout/ScrollView';
import SidebarFilters from './SidebarFilters';

import styles from './SidebarFilters.module.scss';

const { Sider } = Layout;

const StudiesFiltersSider: FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  return (
    <Sider
      trigger={null}
      width={314}
      collapsedWidth={50}
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
    >
      <StackLayout vertical className={styles.siderContainer} center={false} flexContent>
        {collapsed ? (
          <MenuUnfoldOutlined onClick={() => setCollapsed(!collapsed)} />
        ) : (
          <MenuFoldOutlined onClick={() => setCollapsed(!collapsed)} />
        )}

        <ScrollView className={styles.scrollView}>{!collapsed && <SidebarFilters />}</ScrollView>
      </StackLayout>
    </Sider>
  );
};

export default StudiesFiltersSider;
