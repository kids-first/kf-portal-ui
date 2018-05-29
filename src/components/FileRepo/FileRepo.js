import * as React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import { css } from 'emotion';
import styled from 'react-emotion';
import { isObject } from 'lodash';
import { Trans } from 'react-i18next';
import Spinner from 'react-spinkit';

import { Arranger, CurrentSQON, Table, DetectNewVersion } from '@arranger/components/dist/Arranger';
import { replaceSQON } from '@arranger/components/dist/SQONView/utils';
import '@arranger/components/public/themeStyles/beagle/beagle.css';

import SQONURL from 'components/SQONURL';
import SaveQuery from 'components/ShareSaveQuery/SaveQuery';
import ShareQuery from 'components/ShareSaveQuery/ShareQuery';
import DownloadFileButton from 'components/FileRepo/DownloadFileButton';
import FileRepoSidebar from 'components/FileRepoSidebar';
import { FileRepoStats, FileRepoStatsQuery } from 'components/Stats';
import ArrangerConnectionGuard from 'components/ArrangerConnectionGuard';
import AggregationSidebar from 'components/FileRepo/AggregationSidebar';

import DownloadIcon from 'icons/DownloadIcon';

import translateSQON from 'common/translateSQONValue';
import { arrangerProjectId } from 'common/injectGlobals';
import { withApi } from 'services/api';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

const trackFileRepoInteraction = ({ label, ...eventData }) =>
  trackUserInteraction({
    category: 'File Repo',
    action: 'default file repo action',
    ...eventData,
    ...(label && { label: isObject(label) ? JSON.stringify(label) : label }),
  });

const customTableTypes = {
  access: ({ value }) =>
    typeof value !== 'boolean' ? (
      ``
    ) : value ? (
      <img
        src={require('../../assets/icon-controlled-access.svg')}
        alt=""
        css={`
          width: 11px;
          margin: auto;
          display: block;
        `}
      />
    ) : (
      <img
        src={require('../../assets/icon-open-access.svg')}
        alt=""
        css={`
          width: 10px;
          margin: auto;
          display: block;
        `}
      />
    ),
};

const customTableColumns = ({ theme }) => [
  {
    index: 13,
    content: {
      accessor: 'kf_id',
      Header: () => <DownloadIcon width={13} fill={theme.greyScale3} />,
      Cell: ({ value }) => (
        <div
          className={css`
            display: flex;
            align-items: center;
            justify-content: center;
          `}
        >
          <DownloadFileButton kfId={value} />
        </div>
      ),
      width: 40,
      sortable: false,
      resizable: false,
    },
  },
];

const ArrangerContainer = styled('div')`
  display: flex;
  height: 100%;
  box-sizing: border-box;

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

  div.sqon-view {
    flex-grow: 1;
  }
`;

const TableContainer = styled('div')`
  ${({ theme }) => theme.column};
  flex-grow: 1;
  width: 580px;
  padding: 30px;
  position: relative;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
`;

const ToolbarContainer = styled('div')`
  ${({ theme }) => theme.row};
`;

const TableWrapper = styled('div')`
  ${({ theme }) => theme.column};
  min-height: 300px;
  & .ReactTable {
    min-height: 1px;
  }
`;

const FileRepo = compose(injectState, withTheme, withApi)(
  ({
    state,
    effects,
    theme,
    translateSQONValue = translateSQON({
      sets: (state.loggedInUser || {}).sets || [],
    }),
    ...props
  }) => (
    <SQONURL
      render={url => (
        <ArrangerConnectionGuard
          graphqlField={props.graphqlField}
          render={({ connecting, connectionError }) =>
            connecting || connectionError ? (
              <div className={theme.fillCenter}>
                {connectionError ? (
                  `Unable to connect to the file repo, please try again later`
                ) : (
                  <Spinner
                    fadeIn="none"
                    name="circle"
                    color="#a9adc0"
                    style={{ width: 50, height: 50 }}
                  />
                )}
              </div>
            ) : (
              <Arranger
                {...props}
                projectId={arrangerProjectId}
                render={props => {
                  const selectionSQON = props.selectedTableRows.length
                    ? replaceSQON({
                        op: 'and',
                        content: [
                          { op: 'in', content: { field: 'kf_id', value: props.selectedTableRows } },
                        ],
                      })
                    : url.sqon;
                  return (
                    <React.Fragment>
                      <DetectNewVersion {...props} />
                      <ArrangerContainer>
                        <AggregationSidebar
                          {...{ ...props, ...url, translateSQONValue, trackFileRepoInteraction }}
                        />
                        <TableContainer>
                          <ToolbarContainer>
                            <CurrentSQON
                              {...props}
                              {...url}
                              {...{ translateSQONValue }}
                              onClear={() => {
                                trackFileRepoInteraction({
                                  category: TRACKING_EVENTS.categories.fileRepo.dataTable,
                                  action: TRACKING_EVENTS.actions.query.clear,
                                });
                              }}
                            />
                            {url.sqon &&
                              Object.keys(url.sqon).length > 0 && (
                                <FileRepoStatsQuery
                                  {...props}
                                  {...url}
                                  render={({ data: stats, loading: disabled }) => (
                                    <div className={theme.column}>
                                      <ShareQuery
                                        api={props.api}
                                        {...url}
                                        {...{ stats, disabled }}
                                        css={`
                                          flex: 1;
                                        `}
                                      />
                                      <SaveQuery
                                        api={props.api}
                                        {...url}
                                        {...{ stats, disabled }}
                                        css={`
                                          flex: 1;
                                        `}
                                      />
                                    </div>
                                  )}
                                />
                              )}
                          </ToolbarContainer>
                          <FileRepoStats
                            {...props}
                            sqon={selectionSQON}
                            css={`
                              flex: none;
                            `}
                          />
                          <TableWrapper>
                            <Table
                              {...props}
                              {...url}
                              customTypes={customTableTypes}
                              customColumns={customTableColumns({ theme })}
                              columnDropdownText="Columns"
                              fieldTypesForFilter={['text', 'keyword', 'id']}
                              maxPagesOptions={5}
                              onFilterChange={val => {
                                trackFileRepoInteraction({
                                  category: TRACKING_EVENTS.categories.fileRepo.dataTable,
                                  action: TRACKING_EVENTS.actions.filter,
                                  label: val,
                                });
                              }}
                              onTableExport={({ files }) => {
                                trackFileRepoInteraction({
                                  category: TRACKING_EVENTS.categories.fileRepo.dataTable,
                                  action: 'Export TSV',
                                  label: files,
                                });
                              }}
                              exportTSVText={
                                <React.Fragment>
                                  <DownloadIcon
                                    fill={theme.greyScale3}
                                    width={12}
                                    css={`
                                      margin-right: 9px;
                                    `}
                                  />
                                  <Trans>Export TSV</Trans>
                                </React.Fragment>
                              }
                            />
                          </TableWrapper>
                        </TableContainer>
                        <FileRepoSidebar {...props} sqon={selectionSQON} />
                      </ArrangerContainer>
                    </React.Fragment>
                  );
                }}
              />
            )
          }
        />
      )}
    />
  ),
);

export default FileRepo;
