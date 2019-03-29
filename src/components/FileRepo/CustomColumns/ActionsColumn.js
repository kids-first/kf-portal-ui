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
import Row from 'uikit/Row';
import Tooltip from 'uikit/Tooltip';
import { arrangerProjectId } from 'common/injectGlobals';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

const enhance = compose(
  withApi,
  withTheme,
);

const ActionItems = ({ acl, value, fence, userAvailableStudies, theme }) =>
  acl && fence && acl.some(code => userAvailableStudies.includes(code)) ? (
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
      kfId={value}
      fence={fence}
    />
  ) : (
    <Tooltip
      position="bottom"
      interactive
      html={<Row p={'10px'}>You do not have access to this file.</Row>}
    >
      <ControlledIcon fill={theme.primary} />
    </Tooltip>
  );

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
