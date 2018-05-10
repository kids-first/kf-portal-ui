import React from 'react';
import { withProps } from 'recompose';
import filesize from 'filesize';
import { get } from 'lodash';
import Query from '@arranger/components/dist/Query';
import Stats from './Stats';

const queryStringWrapper = (includeIncludeMissing = false) => fields => `
  query($sqon: JSON${includeIncludeMissing ? `, $include_missing: Boolean` : ``}) {
    ${fields}
  }
`;

const participantsStat = {
  icon: (
    <img
      src={require('../../assets/icon-participants.svg')}
      alt=""
      css={`
        width: 21px;
        height: 26px;
        margin-right: 10px;
      `}
    />
  ),
  fragment: (fieldName = 'file') => `
    ${fieldName}: file {
      aggregations(filters: $sqon, include_missing: $include_missing) {
        participants__kf_id {
          buckets{
            key
          }
        }
      }
    }
  `,
  accessor: (fieldName = 'file') => `${fieldName}.aggregations.participants__kf_id.buckets.length`,
  label: 'Participants',
  variables: { include_missing: false },
  query: queryStringWrapper(true),
};

const familyStat = {
  icon: (
    <img
      src={require('../../assets/icon-families-grey.svg')}
      alt=""
      css={`
        width: 26px;
        height: 23px;
        margin-right: 10px;
      `}
    />
  ),
  fragment: (fieldName = 'file') => `
    ${fieldName}: file {
      aggregations(filters: $sqon, include_missing: $include_missing) {
        participants__family__family_id {
          buckets {
            doc_count
          }
        }
      }
    }
  `,
  accessor: (fieldName = 'file') => d =>
    get(d, `${fieldName}.aggregations.participants__family__family_id.buckets.length`) || 0,
  label: 'Families',
  variables: { include_missing: false },
  query: queryStringWrapper(true),
};

const fileStat = {
  icon: (
    <img
      src={require('../../assets/icon-files.svg')}
      alt=""
      css={`
        width: 16px;
        height: 20px;
        margin-right: 10px;
      `}
    />
  ),
  fragment: (fieldName = 'file') => `
    ${fieldName}: file {
      hits(filters: $sqon) {
        total
      }
    }
  `,

  accessor: (fieldName = 'file') => `${fieldName}.hits.total`,
  label: 'Files',
  query: queryStringWrapper(),
};

const fileSizeStat = {
  icon: (
    <img
      src={require('../../assets/icon-database.svg')}
      alt=""
      css={`
        width: 18px;
        height: 22px;
        margin-right: 10px;
      `}
    />
  ),
  fragment: (fieldName = 'file') => `
    ${fieldName}: file {
      aggregations(filters: $sqon, include_missing: $include_missing) {
        size {
          stats {
            sum
          }
        }
      }
    }
  `,
  accessor: (fieldName = 'file') => d =>
    filesize(get(d, `${fieldName}.aggregations.size.stats.sum`) || 0, {
      base: 10,
    }).toUpperCase(),
  label: 'Size',
  variables: { include_missing: false },
  query: queryStringWrapper(true),
};

export const withFileRepoStats = withProps(() => ({
  stats: [fileStat, participantsStat, familyStat, fileSizeStat],
}));

export const FileRepoStats = withFileRepoStats(Stats);

export const FileRepoStatsQuery = withFileRepoStats(props => {
  return (
    <Query
      renderError
      debounceTime={100}
      name={`CombinedFileStatsQuery`}
      variables={{ sqon: props.sqon, include_missing: false }}
      {...props}
      render={({ loading, data }) =>
        props.render(
          loading
            ? 'loading'
            : props.stats.reduce((acc, val) => {
                const getValue =
                  typeof val.accessor(val.label) === 'function'
                    ? val.accessor(val.label)
                    : data => get(data, val.accessor(val.label));
                return {
                  ...acc,
                  [val.label]: getValue(data, val.accessor(val.label)),
                };
              }, {}),
        )
      }
      query={queryStringWrapper(true)(props.stats.map(stat => stat.fragment(stat.label)))}
    />
  );
});

export default Stats;
