import * as React from 'react';
import Component from 'react-component-component';
import { get } from 'lodash';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import Query from '@arranger/components/dist/Query';
import DownloadFileButton from 'components/FileRepo/DownloadFileButton';
import { arrangerGqlRecompose } from 'services/arranger';
import { withApi } from 'services/api';
import DownloadIcon from 'icons/DownloadIcon';
import { ControlledIcon, TableSpinner } from './ui';
import Row from 'uikit/Row';
import { Link } from 'uikit/Core';
import Tooltip from 'uikit/Tooltip';
import { arrangerProjectId } from 'common/injectGlobals';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

const DownloadColumnCellContent = compose(
  withApi,
  withTheme,
)(({ value, api, theme, userProjectIds, fenceStudiesInitialized }) => (
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
          const acl = (get(data, 'file.aggregations.acl.buckets') || []).map(({ key }) => key);
          return (
            <Row center height={'100%'}>
              {loadingQuery ? (
                <TableSpinner style={{ width: 15, height: 15 }} />
              ) : acl ? (
                acl.some(code => userProjectIds.includes(code)) ? (
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
                  />
                ) : (
                  <Tooltip
                    position="bottom"
                    interactive
                    html={<Row p={'10px'}>You do not have access to this file.</Row>}
                  >
                    <ControlledIcon fill={theme.primary} />
                  </Tooltip>
                )
              ) : loadingQuery || fetchedFenceStudies ? (
                <TableSpinner style={{ width: 15, height: 15 }} />
              ) : (
                <ControlledIcon fill={theme.primary} />
              )}
            </Row>
          );
        }}
      />
    )}
  </Component>
));

export default ({ theme, userProjectIds, fenceStudiesInitialized }) => [
  {
    index: 0,
    content: {
      accessor: 'kf_id',
      Cell: props => <Link to={`/file/${props.value}`}>{props.value}</Link>,
      field: 'kf_id',
    },
  },
  {
    index: 13,
    content: {
      accessor: 'kf_id',
      Header: () => <DownloadIcon width={13} fill={theme.greyScale3} />,
      Cell: props => (
        <DownloadColumnCellContent
          {...props}
          userProjectIds={userProjectIds}
          fenceStudiesInitialized={fenceStudiesInitialized}
        />
      ),
      width: 40,
      sortable: false,
      resizable: false,
    },
  },
];
