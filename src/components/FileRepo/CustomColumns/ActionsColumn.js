import * as React from 'react';
import Component from 'react-component-component';
import { get } from 'lodash';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import Query from '@arranger/components/dist/Query';
import DownloadFileButton from 'components/FileRepo/DownloadFileButton';
import { arrangerGqlRecompose, MISSING_DATA } from 'services/arranger';
import { withApi } from 'services/api';
import { ControlledIcon, TableSpinner } from '../ui';
import DownloadIcon from 'icons/DownloadIcon';
import Row from 'uikit/Row';
import Column from 'uikit/Column';
import Tooltip from 'uikit/Tooltip';
import { arrangerProjectId } from 'common/injectGlobals';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { DCF } from 'common/constants';

const enhance = compose(
  withApi,
  withTheme,
);

const FenceDownloadButton = ({ fence, kfId, theme }) =>
  // DCF files currently aren't available to download, so we show tooltip and grey out button
  fence === DCF ? (
    <Tooltip
      position="bottom"
      interactive
      html={<Row p={'10px'}>This file is not available for download.</Row>}
    >
      <DownloadIcon fill={theme.greyScale11} />
    </Tooltip>
  ) : (
    // All other fences are good to go!
    <DownloadFileButton
      onSuccess={url => {
        trackUserInteraction({
          category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
          action: 'Download File',
          label: url,
        });
      }}
      onError={err => {
        trackUserInteraction({
          category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
          action: 'Download File FAILED',
          label: JSON.stringify(err, null, 2),
        });
      }}
      kfId={kfId}
      fence={fence}
    />
  );

const ActionItems = ({ acl, value, fence, userAvailableStudies, theme }) => {
  const hasAccess = acl && fence && acl.some(code => userAvailableStudies.includes(code));
  return (
    <React.Fragment>
      <Column style={{ flex: 1, alignItems: 'center' }}>
        {hasAccess ? (
          <FenceDownloadButton fence={fence} kfId={value} theme={theme} />
        ) : (
          <Tooltip
            position="bottom"
            interactive
            html={<Row p={'10px'}>You do not have access to this file.</Row>}
          >
            <ControlledIcon fill={theme.lightBlue} />
          </Tooltip>
        )}
      </Column>
    </React.Fragment>
  );
};

const ActionsColumn = ({ value, api, theme, fenceStudies }) => (
  <Component
    initialState={{ shouldFetch: true }}
    didUpdate={({ state, setState, props, prevProps }) => {
      if (props.value !== prevProps.value) {
        setState({ shouldFetch: true }, () => {
          setState({ shouldFetch: false });
        });
      }
    }}
  >
    {({ state: { shouldFetch } }) => (
      <Query
        renderError
        api={arrangerGqlRecompose(api, 'TableRowStudyId')}
        projectId={arrangerProjectId}
        shouldFetch={shouldFetch}
        query={`query ($sqon: JSON) {
            file {
              aggregations(filters: $sqon) {
                acl { buckets { key } }
                repository { buckets { key } }
              }
            }
          }`}
        variables={{
          sqon: {
            op: 'and',
            content: [
              {
                op: 'in',
                content: {
                  field: 'kf_id',
                  value: [value],
                },
              },
            ],
          },
        }}
        render={({ loading: loadingQuery, data }) => {
          // The following few lines is mapping through the response data to find which
          //  repository the file belongs in and whether the user has download privelages
          const acl = (get(data, 'file.aggregations.acl.buckets') || []).map(({ key }) => key);
          const repositories = (get(data, 'file.aggregations.repository.buckets') || [])
            .map(({ key }) => key)
            .filter(repo => repo !== MISSING_DATA);
          const repository = get(repositories, 0);
          const userAvailableStudies =
            (repository &&
              get(fenceStudies, `${repository}.authorizedStudies`, []).map(study => study.id)) ||
            [];
          return (
            <Row center height={'100%'}>
              {loadingQuery ? (
                <TableSpinner style={{ width: 15, height: 15 }} />
              ) : (
                <ActionItems
                  acl={acl}
                  value={value}
                  fence={repository}
                  userAvailableStudies={userAvailableStudies}
                  theme={theme}
                />
              )}
            </Row>
          );
        }}
      />
    )}
  </Component>
);

export default enhance(ActionsColumn);
