import * as React from 'react';
import { DB_GA_P } from 'common/constants';
import ExternalLink from 'uikit/ExternalLink';
import { generateUrlForDbGap } from 'common/constants';
import { TRACKING_EVENTS, trackUserInteraction } from 'services/analyticsTracking';
// eslint-disable-next-line react/prop-types
export default ({ original }) => {
  const { study } = original?.participants.hits.edges[0].node || {};
  const { data_access_authority, external_id } = study;
  return data_access_authority === DB_GA_P ? (
    <ExternalLink
      href={generateUrlForDbGap(external_id)}
      onClick={async () => {
        await trackUserInteraction({
          category: TRACKING_EVENTS.categories.fileRepo.dataTable,
          action: `${TRACKING_EVENTS.actions.click}: DbGaP link`,
          label: `${data_access_authority} (${external_id})`,
        });
      }}
    >
      {external_id}
    </ExternalLink>
  ) : (
    ''
  );
};
