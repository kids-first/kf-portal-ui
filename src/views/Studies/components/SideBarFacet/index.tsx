import { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { IExtendedMappingResults } from '@ferlab/ui/core/graphql/types';
import ScrollContent from '@ferlab/ui/core/layout/ScrollContent';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Button } from 'antd';
import cx from 'classnames';
import { INDEXES } from 'graphql/constants';

import FilterList from 'components/uiKit/FilterList';
import { FilterInfo } from 'components/uiKit/FilterList/types';

import { STUDIES_REPO_QB_ID } from '../../utils/constant';

import styles from './index.module.css';

type OwnProps = {
  className?: string;
  extendedMappingResults: IExtendedMappingResults;
  filterInfo: FilterInfo;
  filterWithFooter?: boolean;
};

const SideBarFacet = ({
  className,
  extendedMappingResults,
  filterInfo,
  filterWithFooter,
}: OwnProps) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const { loading } = extendedMappingResults;

  return (
    <StackLayout
      className={cx(className, styles.sideBarFacet, { [styles.collapsed]: collapsed })}
      vertical
      flexContent
    >
      <Button className={styles.button} type="text" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? (
          <MenuUnfoldOutlined className={styles.collapseIcon} />
        ) : (
          <MenuFoldOutlined className={styles.collapseIcon} />
        )}
      </Button>

      <ScrollContent>
        {!collapsed && (
          <div className={styles.content}>
            <FilterList
              loading={loading}
              key={INDEXES.STUDIES}
              index={INDEXES.STUDIES}
              queryBuilderId={STUDIES_REPO_QB_ID}
              extendedMappingResults={extendedMappingResults}
              filterInfo={filterInfo}
              filterWithFooter={filterWithFooter}
            />
          </div>
        )}
      </ScrollContent>
    </StackLayout>
  );
};

export default SideBarFacet;
