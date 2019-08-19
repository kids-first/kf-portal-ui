import * as React from 'react';
import Component from 'react-component-component';
import styled from 'react-emotion';
import { get, intersection } from 'lodash';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import Query from '@kfarranger/components/dist/Query';
import DownloadFileButton from 'components/FileRepo/DownloadFileButton';
import { arrangerGqlRecompose } from 'services/arranger';
import { withApi } from 'services/api';
import { ControlledIcon, TableSpinner } from '../ui';
import DownloadIcon from 'icons/DownloadIcon';
import Row from 'uikit/Row';
import Column from 'uikit/Column';
import Tooltip from 'uikit/Tooltip';
import { arrangerProjectId } from 'common/injectGlobals';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { DCF } from 'common/constants';
import CavaticaLogo from 'icons/CavaticaLogo';
import CavaticaOpenModalWrapper from 'components/cavatica/CavaticaOpenModalWrapper';

const enhance = compose(
  withApi,
  withTheme,
);

const ButtonWrapper = styled(Column)`
  flex: 1;
  align-items: center;
`;

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

const ActionItems = ({ value, fence, hasAccess, theme }) => {
  return (
    <React.Fragment>
      <ButtonWrapper>
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
      </ButtonWrapper>
      <ButtonWrapper>
        {hasAccess && (
          <CavaticaOpenModalWrapper fileIds={[value]}>
            <CavaticaLogo fill={theme.lightBlue} width={16} />
          </CavaticaOpenModalWrapper>
        )}
      </ButtonWrapper>
    </React.Fragment>
  );
};

const ActionsColumn = ({ value, api, theme, fenceAcls }) => (
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
            hits (filters: $sqon) {
              edges {
                node {
                  acl
                  repository
                }
              }
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
          const file = get(data, 'file.hits.edges[0].node', {});
          const acl = file.acl || [];
          const repository = file.repository;
          const hasAccess = acl.includes('*') || intersection(fenceAcls, acl).length > 0;
          return (
            <Row center height={'100%'}>
              {loadingQuery ? (
                <TableSpinner style={{ width: 15, height: 15 }} />
              ) : (
                <ActionItems value={value} fence={repository} hasAccess={hasAccess} theme={theme} />
              )}
            </Row>
          );
        }}
      />
    )}
  </Component>
);

export default enhance(ActionsColumn);
