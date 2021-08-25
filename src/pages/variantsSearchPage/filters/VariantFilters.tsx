import React, { FunctionComponent } from 'react';
import FilterContainer from '@ferlab/ui/core/components/filters/FilterContainer';
import {
  getFilterType,
  getQueryBuilderCache,
  getSelectedFilters,
  updateFilters,
  useFilters,
} from '@ferlab/ui/core/data/filters/utils';
import { resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import { Layout } from 'antd';

//TODO relocate
import { dotToUnderscore } from '../../../components/OntologyBrowser/store';
import { MISSING_DATA } from '../../../services/arranger';
import { MappingResults, useGetPageData } from '../../../store/graphql/utils/actions';
import { MAX_NUMBER_STUDIES } from '../../studies/studies';

import { VARIANT_QUERY } from './queries';

type OwnProps = {
  mappingResults: MappingResults;
};

// const INPUT_FILTER_LIST = [];
const INDEX = 'variants';

//TODO mode to utils
const keyEnhance = (key: string, s: string = ' No Data') => {
  switch (key) {
    case MISSING_DATA:
      return s;
    case '1':
      return 'True';
    case '0':
      return 'False';
    default:
      return key;
  }
};

//TODO mode to utils
const keyEnhanceBooleanOnly = (key: string) => {
  switch (key) {
    case '1':
      return 'true';
    case '0':
      return 'false';
    default:
      return key;
  }
};

const VariantFilters: FunctionComponent<OwnProps> = (props: OwnProps) => {
  const { filters } = useFilters();

  const allSqons = getQueryBuilderCache('study-repo').state;

  let results = useGetPageData(
    {
      sqon: resolveSyntheticSqon(allSqons, filters),
      first: MAX_NUMBER_STUDIES,
      offset: 0,
    },
    VARIANT_QUERY,
    INDEX,
  );

  return (
    <Layout>
      {Object.keys(results.data?.aggregations || []).map((key) => {
        const found = (props.mappingResults?.extendedMapping || []).find(
          (f: any) => f.field === dotToUnderscore(key),
        );
        const filterGroup = {
          field: found?.field || '',
          title: found?.displayName || '',
          type: getFilterType(found?.type || ''),
        };
        // @ts-ignore
        const filters: IFilter[] = results.data.aggregations[key!].buckets.map((f: any) => ({
          data: {
            count: f.doc_count,
            key: keyEnhanceBooleanOnly(f.key),
          },
          name: keyEnhance(f.key),
          id: f.key,
        }));
        const selectedFilters = getSelectedFilters(filters, filterGroup);
        return (
          <FilterContainer
            key={key}
            filterGroup={filterGroup}
            filters={filters}
            onChange={(fg, f) => {
              updateFilters(history, fg, f);
            }}
            selectedFilters={selectedFilters}
          />
        );
      })}
    </Layout>
  );
};

export default VariantFilters;
