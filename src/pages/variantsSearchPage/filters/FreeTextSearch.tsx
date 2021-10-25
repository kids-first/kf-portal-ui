import React, { FunctionComponent } from 'react';
import FilterContainer from '@ferlab/ui/core/components/filters/FilterContainer';
import { IFilter, IFilterGroup, VisualType } from '@ferlab/ui/core/components/filters/types';
import {
  getQueryBuilderCache,
  updateFilters,
  useFilters,
} from '@ferlab/ui/core/data/filters/utils';
import { resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import { AutoComplete, Col, Input, Layout, Row, Spin, Tag } from 'antd';

import { numberFormatCompact, TermAgg } from 'components/Utils/utils';
import history from 'services/history';
import { underscoreToDot } from 'store/graphql/utils';
import { MappingResults, useGetFilterBuckets } from 'store/graphql/utils/actions';
import { VARIANT_AGGREGATION_QUERY } from 'store/graphql/variants/queries';

import { VARIANT_INDEX, VARIANT_REPO_CACHE_KEY } from '../constants';

import styles from './Filters.module.scss';

type OwnProps = {
  field: string;
  mappingResults: MappingResults;
};

const renderItem = (title: string, count: number) => ({
  key: title,
  value: title,
  count: count,
  label: (
    <Row>
      <Col span={18} style={{ whiteSpace: 'normal' }}>
        {title}
      </Col>
      <Col span={6}>
        <Tag>{numberFormatCompact(count)}</Tag>
      </Col>
    </Row>
  ),
});

const FreeTextSearch: FunctionComponent<OwnProps> = ({ field, mappingResults }) => {
  const { filters } = useFilters();

  const foundField = filters.content?.find(
    (f: { content: { field: string } }) => f.content.field === underscoreToDot(field),
  );

  const currentSelection = foundField ? foundField.content.value : [];

  const displayName = !mappingResults.loadingMapping
    ? mappingResults.extendedMapping.find((f) => f.field === underscoreToDot(field))?.displayName ||
      ''
    : '';

  const allSqons = getQueryBuilderCache(VARIANT_REPO_CACHE_KEY).state;
  let results = useGetFilterBuckets(
    {
      sqon: resolveSyntheticSqon(allSqons, filters),
    },
    VARIANT_AGGREGATION_QUERY([field], mappingResults),
    VARIANT_INDEX,
  );

  const filterGroup = {
    field: field,
    title: displayName,
    type: VisualType.Text,
  };

  const termAggs: TermAgg[] =
    results && !results.loading ? results.data.aggregations[field].buckets : [];

  const options =
    results && results.loading
      ? [
          {
            key: 1,
            value: '',
            label: <Spin />,
          },
        ]
      : termAggs.map((t) => renderItem(t.key, t.doc_count));

  const onChange = (fg: IFilterGroup, f: IFilter[]) => {
    updateFilters(history, fg, f);
  };

  return (
    <Layout className={styles.variantFilterFreeTextWrapper}>
      <FilterContainer
        isOpen={false}
        filterGroup={filterGroup}
        filters={[]}
        onChange={() => {}}
        customContent={
          <div className={styles.freeTextFieldContainer}>
            <AutoComplete
              options={options}
              notFoundContent={'No results found'}
              filterOption={(inputValue, option) =>
                option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
              onSelect={(value) => {
                const fg = {
                  field: underscoreToDot(field),
                  title: displayName,
                  type: VisualType.Checkbox,
                };
                const filters = [...currentSelection, value].map((f) => ({
                  data: { key: f },
                  name: f,
                  id: f,
                }));
                onChange(fg, filters);
              }}
            >
              <Input
                maxLength={10}
                allowClear
                size="middle"
                placeholder={`Search ${displayName} term`}
              />
            </AutoComplete>
            <Spin spinning={results.loading} size={'small'}>
              <div className={styles.freeTextFieldCount}>
                {!results.loading ? `${termAggs.length || 0} Terms` : 'Loading Terms...'}
              </div>
            </Spin>
          </div>
        }
      />
    </Layout>
  );
};

export default FreeTextSearch;
