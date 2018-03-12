import React from 'react';
import { withProps } from 'recompose';
import filesize from 'filesize';
import { get } from 'lodash';
import Query from '@arranger/components/dist/Query';
import Stats from './Stats';

const queryStringWrapper = fields => `
  query($sqon: JSON) {
    ${fields}
  }
`;

const participantsStat = {
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
      aggregations(filters: $sqon) {
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
};

export const withFileRepoStats = withProps(() => ({
  query: fragment => queryStringWrapper(fragment),
  stats: [
    {
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
    },
    participantsStat,
    {
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
          aggregations(filters: $sqon) {
            participants__family__family_id {
              buckets{
                key
              }
            }
          }
        }
      `,
      accessor: (fieldName = 'file') =>
        `${fieldName}.aggregations.participants__family__family_id.buckets.length`,
      label: 'Families',
    },
    {
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
          aggregations(filters: $sqon) {
            file_size {
              stats {
                sum
              }
            }
          }
        }
      `,
      accessor: (fieldName = 'file') => d =>
        filesize(get(d, `${fieldName}.aggregations.file_size.stats.sum`) || 0, {
          base: 10,
        }).toUpperCase(),
      label: 'Size',
    },
  ],
}));

export const FileRepoStats = withFileRepoStats(Stats);

export const FileRepoStatsQuery = withFileRepoStats(props => {
  return (
    <Query
      debounceTime={100}
      name={`CombinedFileStatsQuery`}
      variables={{ sqon: props.sqon }}
      {...props}
      render={data =>
        props.render(
          data
            ? props.stats.reduce((acc, val) => {
                const getValue =
                  typeof val.accessor(val.label) === 'function'
                    ? val.accessor(val.label)
                    : data => get(data, val.accessor(val.label));
                return {
                  ...acc,
                  [val.label]: getValue(data, val.accessor(val.label)),
                };
              }, {})
            : 'loading',
        )
      }
      query={queryStringWrapper(props.stats.map((stat, i) => stat.fragment(stat.label)))}
    />
  );
});

export const FamilyManifestStats = withProps(() => ({
  query: fragment => queryStringWrapper(fragment),
  stats: [
    participantsStat,
    {
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
          aggregations(filters: $sqon) {
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
    },
    {
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
          aggregations(filters: $sqon) {
            participants__family__family_members__kf_id {
              buckets {
                doc_count
              }
            }
          }
        }
      `,
      accessor: (fieldName = 'file') => d =>
        get(
          d,
          `${fieldName}.aggregations.participants__family__family_members__kf_id.buckets.length`,
        ) || 0,
      label: 'Family Members',
    },
  ],
}))(Stats);

export default Stats;
