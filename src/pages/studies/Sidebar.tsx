import React, { useState } from 'react';

import { Layout } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import ScrollView from '@ferlab/ui/core/layout/ScrollView';
import SidebarFilters from './SidebarFilters';
import { SidebarData } from 'store/graphql/studies/actions';

import styles from './Sidebar.module.scss';

const { Sider } = Layout;

type StudiesProps = {
  onChange: () => void;
};
type OwnProps = SidebarData & StudiesProps;

const StudiesFiltersSider = ({ studiesResults, studiesMappingResults, onChange }: OwnProps) => {
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

        <ScrollView className={styles.scrollView}>
          {!collapsed && (
            <SidebarFilters
              onChange={onChange}
              studiesResults={studiesResults}
              studiesMappingResults={studiesMappingResults}
            />
          )}
        </ScrollView>
      </StackLayout>
    </Sider>
  );
};

export default StudiesFiltersSider;
