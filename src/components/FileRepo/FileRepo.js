import * as React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import isObject from 'lodash/isObject';
import FilterIcon from 'react-icons/lib/fa/filter';
import { Layout } from 'antd';

import Tooltip from 'uikit/Tooltip';
import { FilterInput } from 'uikit/Input';
import Column from 'uikit/Column';
import Row from 'uikit/Row';
import CavaticaCopyButton from 'components/cavatica/CavaticaCopyButton';
import DownloadButton from './DownloadButton';

import { Arranger, CurrentSQON, Table } from '@kfarranger/components/dist/Arranger';
import { replaceSQON } from '@kfarranger/components/dist/SQONView/utils';

import theme from 'theme/defaultTheme';
import SQONURL from 'components/SQONURL';
import SaveQuery from 'components/LoadShareSaveDeleteQuery/SaveQuery';
import ShareQuery from 'components/LoadShareSaveDeleteQuery/ShareQuery';
import { FileRepoStatsQuery } from 'components/Stats';
import ArrangerConnectionGuard from 'components/ArrangerConnectionGuard';
import AggregationSidebar from 'components/FileRepo/AggregationSidebar';
import DownloadIcon from 'icons/DownloadIcon';
import translateSQON from 'common/translateSQONValue';
import { arrangerProjectId } from 'common/injectGlobals';
import { withApi } from 'services/api';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { fenceConnectionInitializeHoc } from 'stateProviders/provideFenceConnections';
import { ControlledIcon, OpenIcon, TableSpinner, SaveShareButtonContainer } from './ui';
import customTableColumns from './customTableColumns';
import { fillCenter } from 'theme/tempTheme.module.css';
import './FileRepo.css';
import StatsBar from './StatsBar';

const trackFileRepoInteraction = ({ label, ...eventData }) =>
  trackUserInteraction({
    category: 'File Repo',
    action: 'default file repo action',
    ...eventData,
    ...(label && { label: isObject(label) ? JSON.stringify(label) : label }),
  });

const customTableTypes = {
  access: ({ value }) => (
    <Row className="controlledAccess" center>
      {typeof value !== 'boolean' ? (
        ``
      ) : value ? (
        <ControlledIcon width={12} height={12} />
      ) : (
        <OpenIcon />
      )}
    </Row>
  ),
};

const TableHeaderContent = ({ sqon, disabled, selectedTableRows, ...props }) => {
  return (
    <Row className={'relative'} right>
      <Tooltip
        position="top"
        hideTitle
        html={
          <Row className={'relative'} p={'10px'}>
            {disabled
              ? 'Please select files in the table for this action.'
              : 'Cavatica is a cloud processing platform where files can be ' +
                'linked (not duplicated) and used immediately.'}
          </Row>
        }
      >
        <CavaticaCopyButton
          fileIds={selectedTableRows}
          sqon={sqon}
          style={{
            justifyContent: 'flex-start',
            marginTop: '3px',
            fontSize: '11px',
          }}
          text="Analyze in Cavatica"
          {...props}
        />
      </Tooltip>
      {disabled ? (
        <Tooltip
          position="top"
          hideTitle
          html={<Row>Please select files in the table for this action.</Row>}
        >
          <DownloadButton
            sqon={sqon}
            {...props}
            isFileRepo={true}
            className={'download-btn-file-repo'}
          />
        </Tooltip>
      ) : (
        <DownloadButton
          sqon={sqon}
          {...props}
          isFileRepo={true}
          className={'download-btn-file-repo'}
        />
      )}
    </Row>
  );
};

const enhance = compose(injectState, withApi, fenceConnectionInitializeHoc);

const FileRepo = ({
  state,
  effects,
  gen3User,
  translateSQONValue = translateSQON({
    sets: (state.loggedInUser || {}).sets || [],
  }),
  userProjectIds = gen3User ? Object.keys(gen3User.projects) : [],
  ...props
}) => (
  <SQONURL
    render={(url) => (
      <ArrangerConnectionGuard
        graphqlField={props.graphqlField}
        render={({ connecting, connectionError }) =>
          connecting || connectionError ? (
            <div className={fillCenter}>
              {connectionError ? (
                `Unable to connect to the file repo, please try again later`
              ) : (
                <Column className="tableSpinnerWrapper">
                  <TableSpinner />
                </Column>
              )}
            </div>
          ) : (
            <Arranger
              {...props}
              projectId={arrangerProjectId}
              render={(props) => {
                const selectionSQON = props.selectedTableRows.length
                  ? replaceSQON({
                      op: 'and',
                      content: [
                        {
                          op: 'in',
                          content: { field: 'kf_id', value: props.selectedTableRows },
                        },
                      ],
                    })
                  : url.sqon;
                return (
                  <Layout className="arranger-container">
                    <AggregationSidebar
                      {...{ ...props, ...url, translateSQONValue, effects }}
                      trackFileRepoInteraction={trackFileRepoInteraction}
                    />
                    <Column className="arranger-table-container">
                      <Row mb={url.sqon ? 3 : 0}>
                        <CurrentSQON
                          {...props}
                          {...url}
                          {...{ translateSQONValue }}
                          onClear={() => {
                            trackFileRepoInteraction({
                              category: TRACKING_EVENTS.categories.fileRepo.dataTable,
                              action: TRACKING_EVENTS.actions.query.clear,
                            });
                            trackFileRepoInteraction({
                              category: 'File Repo',
                              action: TRACKING_EVENTS.actions.query.abandoned,
                              label: 'cleared SQON',
                              value: 1,
                            });
                          }}
                        />
                        {url.sqon && Object.keys(url.sqon).length > 0 && (
                          <FileRepoStatsQuery
                            {...props}
                            {...url}
                            render={({ data: stats, loading: disabled }) => (
                              <Row className="querySharing-container">
                                <SaveShareButtonContainer>
                                  <ShareQuery api={props.api} {...url} {...{ stats, disabled }} />
                                </SaveShareButtonContainer>
                                <SaveShareButtonContainer>
                                  <SaveQuery api={props.api} {...url} {...{ stats, disabled }} />
                                </SaveShareButtonContainer>
                              </Row>
                            )}
                          />
                        )}
                      </Row>
                      <StatsBar api={props.api} sqon={selectionSQON} />
                      <Column className="arranger-table-wrapper">
                        <Table
                          {...props}
                          {...url}
                          keepSelectedOnPageChange
                          customHeaderContent={
                            <TableHeaderContent {...props} sqon={selectionSQON} disabled={false} />
                          }
                          customTypes={customTableTypes}
                          showFilterInput={false}
                          InputComponent={(props) => (
                            <FilterInput {...props} LeftIcon={FilterIcon} />
                          )}
                          customColumns={customTableColumns({
                            theme,
                            userProjectIds,
                            fenceAcls: state.fenceAcls,
                          })}
                          filterInputPlaceholder={'Filter table'}
                          columnDropdownText="Columns"
                          fieldTypesForFilter={['text', 'keyword', 'id']}
                          maxPagesOptions={5}
                          onFilterChange={(val) => {
                            if (val !== '') {
                              trackFileRepoInteraction({
                                category: TRACKING_EVENTS.categories.fileRepo.dataTable,
                                action: TRACKING_EVENTS.actions.filter,
                                label: val,
                              });
                            }
                            if (props.onFilterChange) {
                              props.onFilterChange(val);
                            }
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
                                height={18}
                                style={{ marginRight: '9px' }}
                              />
                              {'Export TSV'}
                            </React.Fragment>
                          }
                        />
                      </Column>
                    </Column>
                  </Layout>
                );
              }}
            />
          )
        }
      />
    )}
  />
);

export default enhance(FileRepo);
