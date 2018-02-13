import * as React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';

import Arranger, {
  Aggregations,
  CurrentSQON,
  Table,
  DetectNewVersion,
} from '@arranger/components/dist/Arranger';
import '@arranger/components/public/themeStyles/beagle/beagle.css';
import FileRepoSidebar from './FileRepoSidebar';
import Stats from './Stats';
import { replaceSQON } from '@arranger/components/dist/SQONView/utils';

const enhance = compose(injectState);

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
          const selectionSQON = props.selection.length
            ? replaceSQON({
                op: 'and',
                content: [{ op: 'in', content: { field: 'file_id', value: props.selection } }],
              })
            : props.sqon;

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
                  <Stats {...props} sqon={selectionSQON} />
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
                  sqon={selectionSQON}
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
