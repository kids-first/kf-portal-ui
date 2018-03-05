import React from 'react';
import { withProps } from 'recompose';
import filesize from 'filesize';
import { get } from 'lodash';
import Stats from './Stats';

export const FileRepoStats = withProps(() => ({
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
      query: `
      query($sqon: JSON) {
        file {
          hits(filters: $sqon) {
            total
          }
        }
      }
    `,
      accessor: 'file.hits.total',
      label: 'Files',
    },
    // {
    //   icon: (
    //     <img
    //       src={require('../../assets/icon-files.svg')}
    //       alt=""
    //       css={`
    //         width: 16px;
    //         height: 20px;
    //         margin-right: 10px;
    //       `}
    //     />
    //   ),
    //   // TODO: update query, there will be a case index.
    //   query: `
    //     query($sqon: JSON) {
    //       file {
    //         hits(filters: $sqon) {
    //           total
    //         }
    //       }
    //     }
    //   `,
    //   accessor: 'file.hits.total',
    //   label: 'Participants',
    // },
    // {
    //   icon: (
    //     <img
    //       src={require('../../assets/icon-files.svg')}
    //       alt=""
    //       css={`
    //         width: 16px;
    //         height: 20px;
    //         margin-right: 10px;
    //       `}
    //     />
    //   ),
    //   // TODO: update query
    //   query: `
    //     query($sqon: JSON) {
    //       file {
    //         hits(filters: $sqon) {
    //           total
    //         }
    //       }
    //     }
    //   `,
    //   accessor: 'file.hits.total',
    //   label: 'Families',
    // },
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
      query: `
      query($sqon: JSON) {
        file {
          aggregations(filters: $sqon) {
            file_size {
              stats {
                sum
              }
            }
          }
        }
      }
    `,
      accessor: d =>
        filesize(get(d, 'file.aggregations.file_size.stats.sum') || 0, {
          base: 10,
        }).toUpperCase(),
      label: 'Size',
    },
  ],
}))(Stats);

export const FamilyManifestStats = withProps(() => ({
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
      query: `
        query($sqon: JSON) {
          participant {
            hits(filters: $sqon) {
              total
            }
          }
        }
      `,
      accessor: 'participant.hits.total',
      label: 'Participants',
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
      query: `
        query($sqon: JSON) {
          file {
            aggregations(filters: $sqon) {
              participants__family__family_id {
                buckets {
                  doc_count
                }
              }
            }
          }
        }
      `,
      accessor: d =>
        get(d, 'file.aggregations.participants__family__family_id.buckets.length') || 0,
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
      query: `
        query($sqon: JSON) {
          file {
            aggregations(filters: $sqon) {
              participants__family__family_members__kf_id {
                buckets {
                  doc_count
                }
              }
            }
          }
        }
      `,
      accessor: d =>
        get(d, 'file.aggregations.participants__family__family_members__kf_id.buckets.length') || 0,
      label: 'Family Members',
    },
  ],
}))(Stats);

export default Stats;
