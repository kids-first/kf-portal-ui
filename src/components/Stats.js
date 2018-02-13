import React from 'react';
import Query from '@arranger/components/dist/Query';
import { get } from 'lodash';
import filesize from 'filesize';

const stats = [
  {
    icon: (
      <img
        src={require('../assets/icon-files.svg')}
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
  //       src={require('../assets/icon-files.svg')}
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
  //       src={require('../assets/icon-files.svg')}
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
        src={require('../assets/icon-database.svg')}
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
];

const Line = () => {
  return (
    <div
      css={`
        width: 1px;
        height: 35px;
        background-color: #d4d6dd;
      `}
    />
  );
};

const Stat = ({ sqon, index, icon = '', accessor = '', label = '', ...props }) => {
  const getValue = typeof accessor === 'function' ? accessor : data => get(data, accessor);

  return (
    <div
      css={`
        display: flex;
        flex-grow: 1;
        justify-content: center;
      `}
    >
      {icon}
      <div
        css={`
          font-size: 18px;
          font-weight: 500;
          letter-spacing: 0.3px;
          color: #343434;
          margin-right: 6px;
        `}
      >
        <Query
          name={`${index}StatQuery`}
          {...props}
          variables={{ sqon }}
          index={index}
          render={data => (data ? (getValue(data, accessor) || '').toLocaleString() : 'loading')}
        />
      </div>
      <div
        css={`
          font-size: 13px;
          font-weight: 300;
          line-height: 1.54;
          letter-spacing: 0.2px;
          color: #74757d;
        `}
      >
        {label}
      </div>
    </div>
  );
};

export default props => (
  <div
    css={`
      border: solid 1px #e0e1e6;
      display: flex;
      padding: 14px 0;
      align-items: center;
    `}
  >
    {stats.map((stat, i) => [
      i > 0 && <Line key={i} />,
      <Stat key={stat.label} {...props} {...stat} />,
    ])}
  </div>
);
