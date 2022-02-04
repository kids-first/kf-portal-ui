import React from 'react';
import Query from '@kfarranger/components/dist/Query';
import { Spin } from 'antd';
import get from 'lodash/get';
import intersection from 'lodash/intersection';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import { arrangerProjectId } from 'common/injectGlobals';
import { ControlledIcon } from 'components/FileRepo//ui';
import DownloadFileButton from 'components/FileRepo/DownloadFileButton';
import DownloadIcon from 'icons/DownloadIcon';
import { TRACKING_EVENTS, trackUserInteraction } from 'services/analyticsTracking';
import { withApi } from 'services/api';
import { arrangerGqlRecompose } from 'services/arranger';
import { OPEN_ACCESS } from 'store/actionCreators/fenceStudies';
import { FenceName } from 'store/fenceTypes';
import theme from 'theme/defaultTheme';
import Row from 'uikit/Row';
import Tooltip from 'uikit/Tooltip';

import './customColumns.css';

const FenceDownloadButton = ({ fence, kfId }) =>
  // DCF files currently aren't available to download, so we show tooltip and grey out button
  fence === FenceName.dcf ? (
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
      if (loadingQuery) {
        return (
          <Row center className={'action-column-row'}>
            <Spin size={'small'} />
          </Row>
        );
      }
      const file = get(data, 'file.hits.edges[0].node', {});
      const acl = file.acl || [];
      const repository = file.repository;
      const hasAccess = acl.includes(OPEN_ACCESS) || intersection(fenceAcls, acl).length > 0;
      return (
        <Row center className={'action-column-row'}>
          {loadingQuery ? (
            <Spin size={'small'} />
          ) : (
            <>
              {hasAccess ? (
                <FenceDownloadButton fence={repository} kfId={value} />
              ) : (
                <Tooltip
                  position="bottom"
                  interactive
                  html={<Row p={'10px'}>You do not have access to this file.</Row>}
                >
                  <ControlledIcon fill={theme.lightBlue} />
                </Tooltip>
              )}
            </>
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

export default compose(withApi)(ActionsColumn);
