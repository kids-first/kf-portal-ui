import React from 'react';
import {
  DatabaseOutlined,
  FileOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';

import { TRACKING_EVENTS, trackUserInteraction } from 'services/analyticsTracking';
import { Api } from 'store/apiTypes';
import {
  QueryType,
  SavedQueriesIdToStatus,
  SavedQueryWithFileContent,
  SplitSavedQueries,
} from 'store/SavedQueriesTypes';
import { LoggedInUser } from 'store/userTypes';
import { Link } from 'uikit/Core';

import SavedQueriesTab from './SavedQueriesTab';

import './SavedQueries.scss';

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

const formatStat = (val: number | string) => (val || 0).toLocaleString();

const FileTab = (props: Props) => {
  const { queries, queryIdToStatus, loggedInUser, deleteParticularSavedQuery, api } = props;

  return (
    <SavedQueriesTab
      items={queries.file}
      queryIdToStatus={queryIdToStatus}
      makeDescription={(item) => {
        const sq = item as SavedQueryWithFileContent;
        return (
          <StackLayout center>
            <StackLayout center horizontal className={'file-stats'} key={'file'}>
              <FileOutlined className={'file-stats-icon'} /> {formatStat(sq?.content?.Files)}
              {' | '}
            </StackLayout>
            <StackLayout center horizontal className={'file-stats'} key={'participants'}>
              <UserOutlined className={'file-stats-icon'} />
              {formatStat(sq?.content?.Participants)}
              {' | '}
            </StackLayout>
            <StackLayout center horizontal className={'file-stats'} key={'families'}>
              <UsergroupAddOutlined className={'file-stats-icon'} />
              {formatStat(sq?.content?.Families)}
              {' | '}
            </StackLayout>
            <StackLayout center horizontal className={'file-stats'} key={'size'}>
              <DatabaseOutlined className={'file-stats-icon'} />
              {formatStat(sq?.content?.Size)}
            </StackLayout>
          </StackLayout>
        );
      }}
      makeItemTitle={(item) => {
        const sq = item as SavedQueryWithFileContent;
        return (
          <Link
            onClick={async () => {
              await trackUserInteraction({
                value: undefined,
                category: TRACKING_EVENTS.categories.user.dashboard.widgets.savedQueries,
                action: `${TRACKING_EVENTS.actions.click} Saved Query Title`,
                label: JSON.stringify(sq),
              });
            }}
            to={`/search${sq.content.longUrl.split('/search')[1]}`}
          >
            {sq.alias}
          </Link>
        );
      }}
      makeNoItemsInfoMessage={() => (
        <>
          Explore the <Link to="/search/file">File Repository</Link> to save queries!
        </>
      )}
      onConfirmCb={async (item) => {
        await trackUserInteraction({
          value: undefined,
          category: TRACKING_EVENTS.categories.user.dashboard.widgets.savedQueries,
          action: TRACKING_EVENTS.actions.query.delete,
          label: JSON.stringify(item),
        });
        deleteParticularSavedQuery(api, item.id, loggedInUser, QueryType.file);
      }}
    />
  );
};

export default FileTab;
