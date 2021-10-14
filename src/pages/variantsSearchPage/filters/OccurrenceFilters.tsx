import React, { FunctionComponent, useState } from 'react';
import { Button, Layout } from 'antd';

import { MappingResults } from 'store/graphql/utils/actions';

import CustomFilterContainer from './CustomFilterContainer';

import styles from './Filters.module.scss';

type OwnProps = {
  mappingResults: MappingResults;
};

//order in list reflects order in UI
const INPUT_FILTER_LIST: string[] = ['studies__study_code', 'zygosity', 'transmissions'];

const OccurrenceFilters: FunctionComponent<OwnProps> = ({ mappingResults }) => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <>
      <div className={styles.expandButtonContainerVariant}>
        <Button onClick={() => setFiltersOpen(!filtersOpen)} type="link">
          {filtersOpen ? 'Collapse all' : 'Expand all'}
        </Button>
      </div>
      <Layout className={styles.variantFilterWrapper}>
        {INPUT_FILTER_LIST.map((inputFilter) => (
          <CustomFilterContainer
            key={inputFilter}
            classname={styles.variantFilterContainer}
            filterKey={inputFilter}
            mappingResults={mappingResults}
            filtersOpen={filtersOpen}
          />
        ))}
      </Layout>
    </>
  );
};

export default OccurrenceFilters;
