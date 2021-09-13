import React from 'react';

import { TRACKING_EVENTS, trackUserInteraction } from 'services/analyticsTracking';
import { Api } from 'store/apiTypes';
import { QueryType, SavedQueriesIdToStatus, SplitSavedQueries } from 'store/SavedQueriesTypes';
import { User } from 'store/userTypes';
import { VirtualStudyPlusId } from 'store/virtualStudiesTypes';
import { Link } from 'uikit/Core';

import SavedQueriesTab from './SavedQueriesTab';

type Props = {
  user: User;
  api: Api;
  deleteParticularSavedQuery: (api: Api, queryId: string, user: User, queryType: QueryType) => void;
  queries: SplitSavedQueries;
  queryIdToStatus: SavedQueriesIdToStatus;
};

const MAX_N_OF_CHARS_FOR_VS_DESCRIPTION = 140;

const truncateWithEllipsis = (description: string) =>
  `${description.slice(0, MAX_N_OF_CHARS_FOR_VS_DESCRIPTION)}...`;

const CohortTab = (props: Props) => {
  const { queries, queryIdToStatus, user, deleteParticularSavedQuery, api } = props;

  return (
    <SavedQueriesTab
      items={queries.cohort}
      queryIdToStatus={queryIdToStatus}
      makeDescription={(item) => {
        const vs = item as VirtualStudyPlusId;
        const descriptionIsLong = vs.description.length >= MAX_N_OF_CHARS_FOR_VS_DESCRIPTION;
        return <>{descriptionIsLong ? truncateWithEllipsis(vs.description) : vs.description}</>;
      }}
      makeItemTitle={(item) => {
        const vs = item as VirtualStudyPlusId;
        return <Link to={`/explore?id=${vs.virtualStudyId}`}>{vs.name}</Link>;
      }}
      makeNoItemsInfoMessage={() => (
        <>
          <Link to="/explore">Explore Data</Link> and save virtual studies!
        </>
      )}
      onConfirmCb={async (item) => {
        await trackUserInteraction({
          value: undefined,
          category: TRACKING_EVENTS.categories.user.dashboard.widgets.savedVirtualStudies,
          action: TRACKING_EVENTS.actions.query.delete,
          label: JSON.stringify(item),
        });
        deleteParticularSavedQuery(api, item.id, user, QueryType.cohort);
      }}
    />
  );
};

export default CohortTab;
