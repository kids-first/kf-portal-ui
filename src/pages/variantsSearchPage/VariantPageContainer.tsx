import React, { useState } from 'react';
import QueryBuilder from '@ferlab/ui/core/components/QueryBuilder';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Typography } from 'antd';

import CaretDownIcon from 'icons/CaretDownIcon';
import CaretRightIcon from 'icons/CaretRightIcon';
import VariantIcon from 'icons/VariantIcon';
import history from 'services/history';

import styles from './VariantPageContainer.module.scss';

const { Title } = Typography;

const VariantPageContainer = () => {
  // Should do something like in StudyPageContainer.tsx
  const [queryBuilderOpen, setQueryBuilderOpen] = useState(true);

  return (
    <StackLayout vertical>
      <div className={styles.queryBuilderTogglerContainer}>
        <div
          className={`${styles.queryBuilderToggler} ${!queryBuilderOpen && styles.togglerClosed}`}
        >
          <a className={styles.togglerIcon} onClick={() => setQueryBuilderOpen(!queryBuilderOpen)}>
            {queryBuilderOpen ? <CaretDownIcon></CaretDownIcon> : <CaretRightIcon></CaretRightIcon>}
          </a>
          <Title level={1} className={styles.togglerTitle}>
            Variants Filter
          </Title>
        </div>
        <QueryBuilder
          className={`${styles.queryBuilder} ${
            !queryBuilderOpen && styles.hidden
          } variant-repo__query-builder`}
          cacheKey="variant-repo"
          currentQuery={{}}
          history={history}
          loading={false}
          total={0}
          dictionary={{}}
          IconTotal={<VariantIcon fill="#383f72"></VariantIcon>}
        />
      </div>
      <StackLayout vertical className={styles.tableContainer}></StackLayout>
    </StackLayout>
  );
};
export default VariantPageContainer;
