// @TODO: Could be exported to ferlab-ui
import cx from 'classnames';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import ScrollContent from '@ferlab/ui/core/layout/ScrollContent';
import { useState } from 'react';
import intl from 'react-intl-universal';

import styles from './index.module.scss';
import { ExtendedMappingResults } from 'graphql/models';
import { STUDIES_REPO_QB_ID } from '../../utils/constant';
import { mapFilterForVariant } from 'utils/fieldMapper';
import FilterList from 'components/uiKit/FilterList';
import { INDEXES } from 'graphql/constants';
import { FilterInfo } from 'components/uiKit/FilterList/types';
const { Title } = Typography;

type OwnProps = {
  className?: string;
  extendedMappingResults: ExtendedMappingResults;
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
      {collapsed ? (
        <MenuUnfoldOutlined
          className={styles.collapseIcon}
          onClick={() => setCollapsed(!collapsed)}
        />
      ) : (
        <MenuFoldOutlined
          className={styles.collapseIcon}
          onClick={() => setCollapsed(!collapsed)}
        />
      )}

      <ScrollContent>
        {!collapsed && (
          <div className={styles.content}>
            <Title className={styles.title} level={5}>
              {intl.get('screen.studies.search')}
            </Title>

            <FilterList
              loading={loading}
              key={INDEXES.STUDY}
              index={INDEXES.STUDY}
              queryBuilderId={STUDIES_REPO_QB_ID}
              extendedMappingResults={extendedMappingResults}
              filterInfo={filterInfo}
              filterMapper={mapFilterForVariant}
            />
          </div>
        )}
      </ScrollContent>
    </StackLayout>
  );
};

export default SideBarFacet;
