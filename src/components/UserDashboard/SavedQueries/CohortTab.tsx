import React from 'react';

import { TRACKING_EVENTS, trackUserInteraction } from 'services/analyticsTracking';
import { Api } from 'store/apiTypes';
import { QueryType, SavedQueriesIdToStatus, SplitSavedQueries } from 'store/SavedQueriesTypes';
import { LoggedInUser } from 'store/userTypes';
import { VirtualStudyPlusId } from 'store/virtualStudiesTypes';
import { Link } from 'uikit/Core';

import SavedQueriesTab from './SavedQueriesTab';

type Props = {
  loggedInUser: LoggedInUser;
  api: Api;
  deleteParticularSavedQuery: (
    api: Api,
    queryId: string,
    loggedInUser: LoggedInUser,
    queryType: QueryType,
  ) => void;
  queries: SplitSavedQueries;
  queryIdToStatus: SavedQueriesIdToStatus;
};

const MAX_N_OF_CHARS_FOR_VS_DESCRIPTION = 140;

const truncateWithEllipsis = (description: string) =>
  `${description.slice(0, MAX_N_OF_CHARS_FOR_VS_DESCRIPTION)}...`;

const CohortTab = (props: Props) => {
  const { queries, queryIdToStatus, loggedInUser, deleteParticularSavedQuery, api } = props;

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
        return <a href={`/explore?id=${vs.virtualStudyId}`}>{vs.name}</a>;
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
        deleteParticularSavedQuery(api, item.id, loggedInUser, QueryType.cohort);
      }}
    />
  );
};

export default CohortTab;
