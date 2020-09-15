import React from 'react';
import get from 'lodash/get';
import intersection from 'lodash/intersection';
import { compose } from 'recompose';
import Query from '@kfarranger/components/dist/Query';

import theme from 'theme/defaultTheme';
import DownloadFileButton from 'components/FileRepo/DownloadFileButton';
import { arrangerGqlRecompose } from 'services/arranger';
import { withApi } from 'services/api';
import { ControlledIcon } from '../ui';
import DownloadIcon from 'icons/DownloadIcon';
import Row from 'uikit/Row';
import Column from 'uikit/Column';
import Tooltip from 'uikit/Tooltip';
import { arrangerProjectId } from 'common/injectGlobals';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { DCF } from 'common/constants';
import CavaticaLogo from 'icons/CavaticaLogo';
import CavaticaOpenModalWrapper from 'components/cavatica/CavaticaOpenModalWrapper';
import { ACTIONS_COLUMNS } from 'common/constants';
import { Spin } from 'antd';
import PropTypes from 'prop-types';
import './customColumns.css';
const enhance = compose(withApi);

const FenceDownloadButton = ({ fence, kfId }) =>
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
      onSuccess={(url) => {
        trackUserInteraction({
          category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
          action: 'Download File',
          label: url,
        });
      }}
      onError={(err) => {
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

FenceDownloadButton.propTypes = {
  fence: PropTypes.string.isRequired,
  kfId: PropTypes.string.isRequired,
};

const ActionItems = ({ value, fence, hasAccess, file }) => (
  <React.Fragment>
    <Column className={'action-items-column'}>
      {hasAccess ? (
        <FenceDownloadButton fence={fence} kfId={value} />
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
    <Column className={'action-items-column'}>
      {hasAccess && (
        <CavaticaOpenModalWrapper
          fileIds={[value]}
          source={{ location: ACTIONS_COLUMNS, hasAccess, file }}
        >
          <CavaticaLogo fill={theme.lightBlue} width={16} />
        </CavaticaOpenModalWrapper>
      )}
    </Column>
  </React.Fragment>
);

ActionItems.propTypes = {
  fence: PropTypes.string.isRequired,
  file: PropTypes.object.isRequired,
  hasAccess: PropTypes.bool.isRequired,
  value: PropTypes.any.isRequired,
};

const ActionsColumn = ({ value, api, fenceAcls }) => (
  <Query
    renderError
    api={arrangerGqlRecompose(api, 'TableRowStudyId')}
    projectId={arrangerProjectId}
    shouldFetch
    query={`query ($sqon: JSON) {
        file {
          hits (filters: $sqon) {
            edges {
              node {
                acl
                repository
                latest_did
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
        <Row center className={'action-column-row'}>
          {loadingQuery ? (
            <Spin size={'small'} />
          ) : (
            <ActionItems value={value} fence={repository} hasAccess={hasAccess} file={file} />
          )}
        </Row>
      );
    }}
  />
);

ActionsColumn.propTypes = {
  api: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  fenceAcls: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default enhance(ActionsColumn);
