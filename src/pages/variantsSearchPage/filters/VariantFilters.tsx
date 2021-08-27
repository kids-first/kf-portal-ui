import React, { FunctionComponent } from 'react';
import { getQueryBuilderCache, useFilters } from '@ferlab/ui/core/data/filters/utils';
import { resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import { Layout, Spin } from 'antd';

import { MappingResults, useGetPageData } from 'store/graphql/utils/actions';

import { generateFilters } from '../../../components/Utils/utils';
import { MAX_NUMBER_STUDIES } from '../../studies/studies';

import { VARIANT_QUERY } from './queries';

type OwnProps = {
  mappingResults: MappingResults;
};

//TODO missing genomic location and External Ref
//order in list reflects order in UI
const INPUT_FILTER_LIST = ['variant_class', 'consequences__consequences'];
const INDEX = 'variants';

const VariantFilters: FunctionComponent<OwnProps> = ({ mappingResults }) => {
  const { filters } = useFilters();

  const allSqons = getQueryBuilderCache('variant-repo').state;

  let results = useGetPageData(
    {
      sqon: resolveSyntheticSqon(allSqons, filters),
      first: MAX_NUMBER_STUDIES, //TODO should be a pagination
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

export default VariantFilters;
