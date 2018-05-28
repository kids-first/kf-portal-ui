import * as React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import { isObject } from 'lodash';
import { Trans } from 'react-i18next';
import Spinner from 'react-spinkit';

import {
  Arranger,
  Aggregations,
  CurrentSQON,
  Table,
  DetectNewVersion,
  QuickSearch,
} from '@arranger/components/dist/Arranger';
import { toggleSQON, replaceSQON } from '@arranger/components/dist/SQONView/utils';
import '@arranger/components/public/themeStyles/beagle/beagle.css';

import SQONURL from 'components/SQONURL';
import SaveQuery from 'components/ShareSaveQuery/SaveQuery';
import ShareQuery from 'components/ShareSaveQuery/ShareQuery';
import DownloadFileButton from 'components/FileRepo/DownloadFileButton';
import FileRepoSidebar from 'components/FileRepoSidebar';
import { config as statsConfig, FileRepoStats, FileRepoStatsQuery } from 'components/Stats';
import AdvancedFacetViewModalContent from 'components/AdvancedFacetViewModal';
import UploadIdsModal from 'components/UploadIdsModal';
import ArrangerConnectionGuard from 'components/ArrangerConnectionGuard';
import { ScrollbarSize } from 'components/ContextProvider/ScrollbarSizeProvider';

import DownloadIcon from 'icons/DownloadIcon';
import InfoIcon from 'icons/InfoIcon';
import { LightButton } from 'uikit/Button';
import Select from 'uikit/Select';

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

const arrangerStyles = css`
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

const UploadIdsButton = ({ theme, state, effects, setSQON, ...props }) => (
  <div
    className={css`
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
    `}
  >
    <LightButton
      className={css`
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
      `}
      onClick={() =>
        effects.setModal({
          title: 'Upload a List of Identifiers',
          component: <UploadIdsModal {...props} {...{ setSQON }} />,
        })
      }
    >
      <Trans css={theme.uppercase}>Upload Ids</Trans>
    </LightButton>
    <Select
      className={css`
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
        border-left: none;
        padding-left: 0;
      `}
      align="right"
      items={state.loggedInUser.sets.map(x => x.setId)}
      itemContainerClassName={css`
        padding: 0px;
        box-shadow: 1px 1px 1px 0px rgba(0, 0, 0, 0.43);
      `}
      itemClassName={css`
        &:hover {
          background-color: ${theme.optionSelected};
        }
      `}
      onChange={(setId, { clearSelection }) => {
        if (setId) {
          setSQON(
            toggleSQON(
              {
                op: 'and',
                content: [
                  {
                    op: 'in',
                    content: {
                      field: 'kf_id',
                      value: [`set_id:${setId}`],
                    },
                  },
                ],
              },
              props.sqon,
            ),
          );
        }
        clearSelection();
      }}
    />
  </div>
);

const AggregationsWrapper = compose(injectState, withTheme)(
  ({
    state,
    effects,
    theme,
    setSQON,
    translateSQONValue,
    aggregationsWrapperRef = React.createRef(),
    ...props
  }) => (
    <ScrollbarSize>
      {({ scrollbarWidth }) => (
        <div
          ref={aggregationsWrapperRef}
          css={`
            height: 100%;
            height: calc(100vh - 180px);
            width: ${300 + scrollbarWidth}px;
            overflow-y: auto;
            background-color: #f4f5f8;
            box-shadow: 0 0 4.9px 0.2px #a0a0a3;
            border: solid 1px #c6c7cc;
            flex: none;
          `}
        >
          <div
            css={`
              display: flex;
              padding: 15px 7px 15px 12px;
            `}
          >
            <div
              css={`
                flex-grow: 1;
                font-size: 18px;
                color: #2b388f;
              `}
            >
              <Trans>Filters</Trans> <InfoIcon />
            </div>
            <LightButton
              css={theme.uppercase}
              onClick={() =>
                effects.setModal({
                  title: 'All Filters',
                  classNames: {
                    modal: css`
                      width: 80%;
                      height: 90%;
                      max-width: initial;
                    `,
                  },
                  component: (
                    <AdvancedFacetViewModalContent
                      {...{
                        ...props,
                        translateSQONValue,
                        closeModal: effects.unsetModal,
                        onClear: () => {
                          trackFileRepoInteraction({
                            category: TRACKING_EVENTS.categories.fileRepo.filters + ' - Advanced',
                            action: TRACKING_EVENTS.actions.query.clear,
                          });
                        },
                        onFilterChange: value => {
                          // TODO: add GA search tracking to filters w/ pageview events (url?filter=value)
                          trackFileRepoInteraction({
                            category: TRACKING_EVENTS.categories.fileRepo.filters + ' - Advanced',
                            action: TRACKING_EVENTS.actions.filter + ' - Search',
                            label: value,
                          });
                        },
                        onTermSelected: ({ field, value, active }) => {
                          if (active) {
                            trackFileRepoInteraction({
                              category: TRACKING_EVENTS.categories.fileRepo.filters + ' - Advanced',
                              action: TRACKING_EVENTS.actions.filter + ' Selected',
                              label: { type: 'filter', value, field },
                            });
                          }
                        },
                        onSqonSubmit: ({ sqon }) => {
                          effects.unsetModal({ callback: () => setSQON(sqon) });
                          trackFileRepoInteraction({
                            category: TRACKING_EVENTS.categories.fileRepo.filters + ' - Advanced',
                            action: 'View Results',
                            label: sqon,
                          });
                        },
                      }}
                      {...{ statsConfig }}
                    />
                  ),
                })
              }
            >
              <Trans css={theme.uppercase}>All Filters</Trans>
            </LightButton>
          </div>
          <div className="aggregation-card">
            <QuickSearch
              {...{ ...props, setSQON, translateSQONValue }}
              placeholder="Enter Identifiers"
              LoadingIcon={
                <Spinner
                  fadeIn="none"
                  name="circle"
                  color="#a9adc0"
                  style={{ width: 15, height: 15 }}
                />
              }
            />
            <UploadIdsButton {...{ theme, effects, state, setSQON, ...props }} />
          </div>
          <Aggregations
            {...{
              ...props,
              setSQON,
              containerRef: aggregationsWrapperRef,
            }}
            onTermSelected={({ active, field, value }) => {
              if (active) {
                trackFileRepoInteraction({
                  category: TRACKING_EVENTS.categories.fileRepo.filters,
                  action: 'Filter Selected',
                  label: { type: 'filter', value, field },
                });
              }
            }}
          />
        </div>
      )}
    </ScrollbarSize>
  ),
);

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
              <div
                css={`
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                `}
              >
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
                    <div
                      css={`
                        height: 1px;
                        flex: 1;
                        overflow: hidden;
                      `}
                    >
                      <DetectNewVersion {...props} />
                      <div css={arrangerStyles}>
                        <AggregationsWrapper {...{ ...props, ...url, translateSQONValue }} />
                        <div style={{ flexGrow: 1, width: 580 }}>
                          <div
                            css={`
                              padding: 30px;
                              display: flex;
                              flex-direction: column;
                              position: relative;
                              height: 100%;
                              box-sizing: border-box;
                              overflow-y: auto;
                            `}
                          >
                            <div
                              css={`
                                flex: none;
                                display: flex;
                              `}
                            >
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
                                      <div
                                        css={`
                                          display: flex;
                                          flex-direction: column;
                                        `}
                                      >
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
                            </div>
                            <FileRepoStats
                              {...props}
                              sqon={selectionSQON}
                              css={`
                                flex: none;
                              `}
                            />
                            <div
                              css={`
                                display: flex;
                                flex-direction: column;
                                min-height: 300px;
                              `}
                            >
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
                            </div>
                          </div>
                        </div>
                        <FileRepoSidebar {...props} sqon={selectionSQON} />
                      </div>
                    </div>
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
