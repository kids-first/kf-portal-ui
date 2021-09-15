import React, { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';
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
    <StackLayout vertical className={styles.siderContainer} center={false} flexContent>
      {collapsed ? (
        <MenuUnfoldOutlined onClick={() => setCollapsed(!collapsed)} />
      ) : (
        <MenuFoldOutlined onClick={() => setCollapsed(!collapsed)} />
      )}

      <div className={styles.scrollView}>
        {!collapsed && (
          <SidebarFilters
            studiesResults={studiesResults}
            studiesMappingResults={studiesMappingResults}
            filters={filters}
          />
        )}
      </div>
    </StackLayout>
  );
};

export default StudiesFiltersSider;
