import * as React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import { css } from 'emotion';
import styled from 'react-emotion';
import { isObject } from 'lodash';
import { Trans } from 'react-i18next';
import Spinner from 'react-spinkit';
import FilterIcon from 'react-icons/lib/fa/filter';

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
import Column from 'uikit/Column';
import { FilterInput } from 'uikit/Input';
import Row from 'uikit/Row';

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

const ArrangerContainer = styled(Row)`
  display: flex;

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

  & .tableToolbar {
    color: ${({ theme }) => theme.greyScale9};
    & .group .dropDownButtonContent {
      color: ${({ theme }) => theme.greyScale9};
    }
    & .group button {
      color: ${({ theme }) => theme.greyScale9};
    }
  }

  .pagination-bottom .-pagination {
    color: ${({ theme }) => theme.greyScale9};
    select {
      color: ${({ theme }) => theme.greyScale9};
    }
  }

  div.sqon-view {
    flex-grow: 1;
  }
`;

const TableContainer = styled(Column)`
  flex-grow: 1;
  width: 580px;
  padding: 30px;
  position: relative;
  height: 100%;
  overflow-y: auto;
`;

const TableWrapper = styled(Column)`
  min-height: 300px;
  flex: 1;
  & .ReactTable {
    min-height: 1px;
  }
`;

const QueryBarContainer = styled(Row)`
  margin-bottom: ${({ sqon }) => (sqon ? '20px' : '0px')};
`;

const QuerySharingContainer = styled(Row)`
  border-style: solid;
  border-color: ${({ theme }) => theme.borderGrey};
  border-width: 1px 1px 1px 0;
  background: ${({ theme }) => theme.backgroundGrey};
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
                          <QueryBarContainer sqon={url.sqon}>
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
                                    <QuerySharingContainer>
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
                                    </QuerySharingContainer>
                                  )}
                                />
                              )}
                          </QueryBarContainer>
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
                              InputComponent={props => (
                                <FilterInput {...props} LeftIcon={FilterIcon} />
                              )}
                              customColumns={customTableColumns({ theme })}
                              filterInputPlaceholder={'Filter table'}
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
