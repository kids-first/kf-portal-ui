import React, { FunctionComponent } from 'react';
import { getQueryBuilderCache, useFilters } from '@ferlab/ui/core/data/filters/utils';
import { resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import { Layout, Spin } from 'antd';

import { MappingResults, useGetPageData } from 'store/graphql/utils/actions';

import { generateFilters } from '../../../components/Utils/utils';

import { VARIANT_QUERY } from './queries';

type OwnProps = {
  mappingResults: MappingResults;
};

//order in list reflects order in UI
const INPUT_FILTER_LIST: string[] = [
  'studies__study_code',
  // 'Zygozity', //TODO what is this???
  // 'Inheritance', //TODO what is this???
];
const INDEX = 'variants';

const OccurenceFilters: FunctionComponent<OwnProps> = ({ mappingResults }) => {
  const { filters } = useFilters();

  const allSqons = getQueryBuilderCache('study-repo').state;

  let results = useGetPageData(
    {
      sqon: resolveSyntheticSqon(allSqons, filters),
      first: 15, //TODO should be a pagination
      offset: 0,
    },
    VARIANT_QUERY(INPUT_FILTER_LIST, mappingResults),
    INDEX,
  );

  return (
    <Layout>
      {results.loading ? <Spin size="large" /> : generateFilters(results, mappingResults)}
    </Layout>
  );
};

export default OccurenceFilters;
