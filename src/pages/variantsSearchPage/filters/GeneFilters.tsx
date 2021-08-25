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

//TODO External Ref
//order in list reflects order in UI
const INPUT_FILTER_LIST = [
  'genes__hpo__hpo_term_label',
  'genes__orphanet__panel',
  'genes__omim__name',
  'genes__ddd__disease_name',
  'genes__cosmic__tumour_types_germline',
];
const INDEX = 'variants';

const GeneFilters: FunctionComponent<OwnProps> = ({ mappingResults }) => {
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

export default GeneFilters;
