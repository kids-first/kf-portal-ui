import React, { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { ISqonGroupFilter } from '@ferlab/ui/core/components/QueryBuilder/types';
import ScrollView from '@ferlab/ui/core/layout/ScrollView';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';

import { SidebarData } from 'store/graphql/studies/actions';

import SidebarFilters from './SidebarFilters';

import styles from './Sidebar.module.scss';

type StudiesProps = {
  filters: ISqonGroupFilter;
};
type OwnProps = SidebarData & StudiesProps;

const StudiesFiltersSider = ({ studiesResults, studiesMappingResults, filters }: OwnProps) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  return (
    <div className={styles.sider} data-collapsed={collapsed}>
      <StackLayout vertical className={styles.siderContainer} center={false} flexContent>
        {collapsed ? (
          <MenuUnfoldOutlined onClick={() => setCollapsed(!collapsed)} />
        ) : (
          <MenuFoldOutlined onClick={() => setCollapsed(!collapsed)} />
        )}

        <ScrollView className={styles.scrollView}>
          {!collapsed && (
            <SidebarFilters
              studiesResults={studiesResults}
              studiesMappingResults={studiesMappingResults}
              filters={filters}
            />
          )}
        </ScrollView>
      </StackLayout>
    </div>
  );
};

export default StudiesFiltersSider;
