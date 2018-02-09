import * as React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { get } from 'lodash';
import filesize from 'filesize';

import Arranger, {
  Aggregations,
  CurrentSQON,
  Table,
  DetectNewVersion,
} from '@arranger/components/dist/Arranger';
import '@arranger/components/public/themeStyles/beagle/beagle.css';
import FileRepoSidebar from './FileRepoSidebar';
import Stats from './Stats';

const enhance = compose(injectState);

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
    // TODO: update query
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
    label: 'Participants',
  },
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
    // TODO: update query
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
    label: 'Families',
  },
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

const FileRepo = ({ state, effects }) => {
  return (
    <div
      css={`
        .ReactTable .rt-thead .rt-th.-sort-desc,
        .ReactTable .rt-thead .rt-td.-sort-desc {
          box-shadow: inset 0 -3px 0 0 rgba(64, 76, 154, 0.7);
        }

        .ReactTable .rt-thead .rt-th.-sort-asc,
        .ReactTable .rt-thead .rt-td.-sort-asc {
          box-shadow: inset 0 3px 0 0 rgba(64, 76, 154, 0.7);
        }

        .tableToolbar {
          border-left: solid 1px #e0e1e6;
          border-right: solid 1px #e0e1e6;
        }
      `}
    >
      <h2>File Repository</h2>
      <pre>
        {state.loggedInUser && (
          <div>
            Seeing files as {state.loggedInUser.firstName} {state.loggedInUser.lastName} a{' '}
            {state.loggedInUser.roles}
          </div>
        )}
      </pre>
      {!state.loggedInUser && <div>Seeing files as annon</div>}
      <Arranger
        index="file"
        projectId="jan31"
        render={props => {
          return (
            <div>
              <DetectNewVersion {...props} />
              <div style={{ display: 'flex' }}>
                <Aggregations {...props} />
                <div
                  style={{
                    position: 'relative',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 30,
                  }}
                >
                  <CurrentSQON {...props} />
                  <Stats {...props} projectId={props.projectId} index={props.index} stats={stats} />
                  <Table
                    {...props}
                    widths={{ access: 80 }}
                    customTypes={{
                      access: ({ value }) => {
                        switch (value) {
                          case 'controlled':
                            return (
                              <img
                                src={require('../assets/icon-controlled-access.svg')}
                                alt=""
                                css={`
                                  width: 11px;
                                  margin: auto;
                                  display: block;
                                `}
                              />
                            );
                          case 'open':
                            return (
                              <img
                                src={require('../assets/icon-open-access.svg')}
                                alt=""
                                css={`
                                  width: 10px;
                                  margin: auto;
                                  display: block;
                                `}
                              />
                            );
                          default:
                            return 'unknown';
                        }
                      },
                    }}
                  />
                </div>
                <FileRepoSidebar
                  {...props}
                  style={{ flex: 'none' }}
                  streamData={props.streamData(props.index, props.projectId)}
                />
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

export default enhance(FileRepo);
