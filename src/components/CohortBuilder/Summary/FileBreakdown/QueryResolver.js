import React from 'react';
import { withApi } from 'services/api';
import QueriesResolver from '../../QueriesResolver';
import gql from 'graphql-tag';
import { get } from 'lodash';

/**
 * Queries:
 * - Get all File Data Types from Summary index
 * - Get all Experimental Strategies
 * - Get total file counts for each combination of file data type / experimental strategy (rows)
 */
const EMTPY_EXP = '__missing__';
const toFileBreakdownQueries = ({ sqon, dataType, expStrat, participants }) => ({
  query: gql`
    query($sqon: JSON, $dataType: String, $expStrat: String) {
      participant {
        aggregations(
          filters: {
            op: "and"
            content: [
              $sqon
              { op: "in", content: { field: "files.experiment_strategies", value: [$expStrat] } }
              { op: "in", content: { field: "files.data_type", value: [$dataType] } }
            ]
          }
        ) {
          files__kf_id {
            buckets {
              doc_count
              key
            }
          }
        }
      }
    }
  `,
  variables: { sqon, dataType, expStrat },
  transform: data => {
    const files = get(data, 'data.participant.aggregations.files__kf_id.buckets', []).length;

    return {
      dataType,
      expStrat,
      files,
      participants,
    };
  },
});

const toExpStratQueries = ({ fileDataTypes, sqon }) =>
  fileDataTypes.map(dataType => ({
    query: gql`
      query($sqon: JSON, $dataType: String) {
        participant {
          aggregations(
            aggregations_filter_themselves: true
            filters: {
              op: "and"
              content: [
                $sqon
                { op: "in", content: { field: "files.data_type", value: [$dataType] } }
              ]
            }
          ) {
            files__experiment_strategies {
              buckets {
                key
              }
            }
            kf_id {
              buckets {
                key
              }
            }
          }
        }
      }
    `,
    variables: { sqon, dataType },
    transform: data => {
      /**
       * Return complete file breakdown queries
       * - each combination of file data type and file experimental strategy
       */
      const expStratBuckets = get(
        data,
        'data.participant.aggregations.files__experiment_strategies.buckets',
        [],
      );

      const participants = get(data, 'data.participant.aggregations.kf_id.buckets', []).map(
        b => b.key,
      );

      const fileBreakdownQueries = expStratBuckets.map(strategy =>
        toFileBreakdownQueries({ sqon, dataType, expStrat: strategy.key, participants }),
      );

      return fileBreakdownQueries;
    },
  }));

const QueryResolver = ({ data, api, sqon, children }) => (
  <QueriesResolver api={api} queries={toExpStratQueries({ fileDataTypes: data, sqon })}>
    {({ data: fileBreakdownQueries, isLoading }) => {
      return isLoading ? (
        <div>loading</div>
      ) : (
        <QueriesResolver api={api} queries={fileBreakdownQueries.flat()}>
          {children}
        </QueriesResolver>
      );
    }}
  </QueriesResolver>
);

export default withApi(QueryResolver);
