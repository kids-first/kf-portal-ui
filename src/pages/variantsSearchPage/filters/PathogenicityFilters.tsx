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
const INPUT_FILTER_LIST = [
  'clinvar__clin_sig',
  'consequences__vep_impact',
  'consequences__predictions__sift_pred',
  'consequences__predictions__polyphen2_hvar_pred',
  'consequences__predictions__fathmm_pred',
  // 'consequences__predictions__cadd_rankscore',//TODO manage numeric
  // 'consequences__predictions__dann_rankscore',//TODO manage numeric
  'consequences__predictions__lrt_pred',
  // 'consequences__predictions__revel_rankscore', //TODO manage numeric
];
const INDEX = 'variants';

const PathogenicityFilters: FunctionComponent<OwnProps> = ({ mappingResults }) => {
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

export default PathogenicityFilters;
