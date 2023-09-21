import cx from 'classnames';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import ScrollContent from '@ferlab/ui/core/layout/ScrollContent';
import { useState } from 'react';

import styles from './index.module.scss';
import { STUDIES_REPO_QB_ID } from '../../utils/constant';
import FilterList from 'components/uiKit/FilterList';
import { INDEXES } from 'graphql/constants';
import { FilterInfo } from 'components/uiKit/FilterList/types';
import { Button, Spin } from 'antd';
import { IExtendedMappingResults } from '@ferlab/ui/core/graphql/types';

type OwnProps = {
  className?: string;
  extendedMappingResults: IExtendedMappingResults;
  filterInfo: FilterInfo;
};

const SideBarFacet = ({ className, extendedMappingResults, filterInfo }: OwnProps) => {
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
           { extendedMappingResults.loading
            ? <Spin className={styles.filterLoader} spinning />
            : <FilterList
              loading={loading}
              key={INDEXES.STUDIES}
              index={INDEXES.STUDIES}
              queryBuilderId={STUDIES_REPO_QB_ID}
              extendedMappingResults={extendedMappingResults}
              filterInfo={filterInfo}
            />}
          </div>
        )}
      </ScrollContent>
    </StackLayout>
  );
};

export default SideBarFacet;
