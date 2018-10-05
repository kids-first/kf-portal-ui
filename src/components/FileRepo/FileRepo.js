import * as React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import { isObject } from 'lodash';
import { Trans } from 'react-i18next';
import FilterIcon from 'react-icons/lib/fa/filter';

import { Arranger, CurrentSQON, Table, DetectNewVersion } from '@arranger/components/dist/Arranger';
import { replaceSQON } from '@arranger/components/dist/SQONView/utils';

import SQONURL from 'components/SQONURL';
import SaveQuery from 'components/ShareSaveQuery/SaveQuery';
import ShareQuery from 'components/ShareSaveQuery/ShareQuery';
import FileRepoSidebar from 'components/FileRepoSidebar';
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

const FileRepoContent = compose(withTheme)(
  ({ url, translateSQONValue, theme, userProjectIds, loadingGen3User, arrangerProps }) => {
    const onSqonClear = arrangerProps => args => {
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
      if (arrangerProps.onClear) {
        return arrangerProps.onClear(args);
      }
    };

    const onTableFilterChange = arrangerProps => val => {
      if (val !== '') {
        trackFileRepoInteraction({
          category: TRACKING_EVENTS.categories.fileRepo.dataTable,
          action: TRACKING_EVENTS.actions.filter,
          label: val,
        });
      }
      if (arrangerProps.onFilterChange) {
        arrangerProps.onFilterChange(val);
      }
    };

    const onTableExport = arrangerProps => ({ files, ...rest }) => {
      trackFileRepoInteraction({
        category: TRACKING_EVENTS.categories.fileRepo.dataTable,
        action: 'Export TSV',
        label: files,
      });
      if (arrangerProps.onTableExport) {
        arrangerProps.onTableExport({ files, ...rest });
      }
    };

    const selectionSQON = arrangerProps.selectedTableRows.length
      ? replaceSQON({
          op: 'and',
          content: [
            {
              op: 'in',
              content: { field: 'kf_id', value: arrangerProps.selectedTableRows },
            },
          ],
        })
      : url.sqon;
    return (
      <React.Fragment>
        <DetectNewVersion {...arrangerProps} />
        <ArrangerContainer>
          <AggregationSidebar
            {...{ ...arrangerProps, ...url, translateSQONValue }}
            trackFileRepoInteraction={trackFileRepoInteraction}
          />
          <TableContainer>
            <Row mb={url.sqon ? 3 : 0}>
              <CurrentSQON
                {...arrangerProps}
                {...url}
                {...{ translateSQONValue }}
                onClear={onSqonClear(arrangerProps)}
              />
              {url.sqon &&
                Object.keys(url.sqon).length > 0 && (
                  <FileRepoStatsQuery
                    {...arrangerProps}
                    {...url}
                    render={({ data: stats, loading: disabled }) => (
                      <QuerySharingContainer>
                        <ShareQuery api={arrangerProps.api} {...url} {...{ stats, disabled }} />
                        <SaveQuery api={arrangerProps.api} {...url} {...{ stats, disabled }} />
                      </QuerySharingContainer>
                    )}
                  />
                )}
            </Row>
            <FileRepoStats
              {...arrangerProps}
              sqon={selectionSQON}
              css={`
                flex: none;
              `}
            />
            <TableWrapper>
              <Table
                {...arrangerProps}
                {...url}
                customTypes={customTableTypes}
                InputComponent={inputProps => <FilterInput {...inputProps} LeftIcon={FilterIcon} />}
                customColumns={customTableColumns({
                  theme,
                  userProjectIds,
                  loadingGen3User,
                })}
                filterInputPlaceholder={'Filter table'}
                columnDropdownText="Columns"
                fieldTypesForFilter={['text', 'keyword', 'id']}
                maxPagesOptions={5}
                onFilterChange={onTableFilterChange(arrangerProps)}
                onTableExport={onTableExport(arrangerProps)}
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
          <FileRepoSidebar {...arrangerProps} sqon={selectionSQON} />
        </ArrangerContainer>
      </React.Fragment>
    );
  },
);

export default compose(injectState, withTheme, withApi)(
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
        <Gen3UserProvider
          render={({ loading: loadingGen3User, gen3User }) => {
            const userProjectIds = gen3User ? Object.keys(gen3User.projects) : [];
            return (
              <ArrangerConnectionGuard
                graphqlField={props.graphqlField}
                render={({ connecting, connectionError }) =>
                  connecting || connectionError ? (
                    <div className={theme.fillCenter}>
                      {connectionError ? (
                        `Unable to connect to the file repo, please try again later`
                      ) : (
                        <TableSpinner />
                      )}
                    </div>
                  ) : (
                    <Arranger
                      {...props}
                      projectId={arrangerProjectId}
                      render={arrangerProps => (
                        <FileRepoContent
                          {...{
                            arrangerProps,
                            translateSQONValue,
                            url,
                            userProjectIds,
                            loadingGen3User,
                          }}
                        />
                      )}
                    />
                  )
                }
              />
            );
          }}
        />
      )}
    />
  ),
);
