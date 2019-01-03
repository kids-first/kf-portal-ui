import * as React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import { isObject } from 'lodash';
import { Trans } from 'react-i18next';
import FilterIcon from 'react-icons/lib/fa/filter';

import { Arranger, CurrentSQON, Table } from '@arranger/components/dist/Arranger';
import { replaceSQON } from '@arranger/components/dist/SQONView/utils';

import SQONURL from 'components/SQONURL';
import SaveQuery from 'components/ShareSaveQuery/SaveQuery';
import ShareQuery from 'components/ShareSaveQuery/ShareQuery';
import { FileRepoStats, FileRepoStatsQuery } from 'components/Stats';
import ArrangerConnectionGuard from 'components/ArrangerConnectionGuard';
import AggregationSidebar from 'components/FileRepo/AggregationSidebar';
import { Gen3UserProvider } from 'services/gen3';
import DownloadIcon from 'icons/DownloadIcon';
import translateSQON from 'common/translateSQONValue';
import { arrangerProjectId } from 'common/injectGlobals';
import { withApi } from 'services/api';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { FilterInput } from 'uikit/Input';
import Row from 'uikit/Row';
import {
  ArrangerContainer,
  TableContainer,
  TableWrapper,
  QuerySharingContainer,
  ControlledIcon,
  OpenIcon,
  TableSpinnerWrapper,
  TableSpinner,
} from './ui';
import customTableColumns from './customTableColumns';

const trackFileRepoInteraction = ({ label, ...eventData }) =>
  trackUserInteraction({
    category: 'File Repo',
    action: 'default file repo action',
    ...eventData,
    ...(label && { label: isObject(label) ? JSON.stringify(label) : label }),
  });

const customTableTypes = {
  access: ({ value }) => (
    <Row center>{typeof value !== 'boolean' ? `` : value ? <ControlledIcon /> : <OpenIcon />}</Row>
  ),
};

const FileRepo = compose(
  injectState,
  withTheme,
  withApi,
)(
  ({
    state,
    effects,
    theme,
    loadingGen3User,
    gen3User,
    translateSQONValue = translateSQON({
      sets: (state.loggedInUser || {}).sets || [],
    }),
    userProjectIds = gen3User ? Object.keys(gen3User.projects) : [],
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
                  <TableSpinnerWrapper>
                    <TableSpinner />
                  </TableSpinnerWrapper>
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
                          {
                            op: 'in',
                            content: { field: 'kf_id', value: props.selectedTableRows },
                          },
                        ],
                      })
                    : url.sqon;
                  return (
                    <React.Fragment>
                      <ArrangerContainer>
                        <AggregationSidebar
                          {...{ ...props, ...url, translateSQONValue }}
                          trackFileRepoInteraction={trackFileRepoInteraction}
                        />
                        <TableContainer>
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
                                  <QuerySharingContainer>
                                    <ShareQuery api={props.api} {...url} {...{ stats, disabled }} />
                                    <SaveQuery api={props.api} {...url} {...{ stats, disabled }} />
                                  </QuerySharingContainer>
                                )}
                              />
                            )}
                          </Row>
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
                              showFilterInput={false}
                              InputComponent={props => (
                                <FilterInput {...props} LeftIcon={FilterIcon} />
                              )}
                              customColumns={customTableColumns({
                                theme,
                                userProjectIds,
                                loadingGen3User,
                              })}
                              filterInputPlaceholder={'Filter table'}
                              columnDropdownText="Columns"
                              fieldTypesForFilter={['text', 'keyword', 'id']}
                              maxPagesOptions={5}
                              onFilterChange={val => {
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

export default props => (
  <Gen3UserProvider
    render={({ loading: loadingGen3User, gen3User }) => (
      <FileRepo {...{ ...props, loadingGen3User, gen3User }} />
    )}
  />
);
