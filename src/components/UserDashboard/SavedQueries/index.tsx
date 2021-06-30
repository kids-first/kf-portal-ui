import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  DatabaseOutlined,
  FileOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Card from '@ferlab/ui/core/view/GridCard';
import { Badge, Result, Space } from 'antd';

import { TRACKING_EVENTS, trackUserInteraction } from 'services/analyticsTracking';
import { deleteParticularSavedQuery, fetchSavedQueries } from 'store/actionCreators/SavedQueries';
import { Api } from 'store/apiTypes';
import { RootState } from 'store/rootState';
import {
  DispatchSavedQueries,
  QueryType,
  SavedQueryWithFileContent,
} from 'store/SavedQueriesTypes';
import {
  selectErrorFetchAllSavedQueries,
  selectIsLoadingAllSavedQueries,
  selectSavedQueries,
  selectSavedQueryIdToStatus,
} from 'store/selectors/savedQueries';
import { LoggedInUser } from 'store/userTypes';
import { VirtualStudyPlusId } from 'store/virtualStudiesTypes';
import { Link } from 'uikit/Core';
import { Spinner } from 'uikit/Spinner';

import SavedQueriesTab from './SavedQueriesTab';

import './SavedQueries.scss';
// @ts-ignore
import { antCardHeader } from '../../CohortBuilder/Summary/Cards/StudiesChart.module.css';

const TAB_KEY_COHORT_QUERIES = `${QueryType.cohort}Tab`;
const TAB_KEY_FILES_QUERIES = `${QueryType.file}Tab`;

type OwnProps = {
  loggedInUser: LoggedInUser;
  api: Api;
};

const mapDispatchToProps = (dispatch: DispatchSavedQueries) => ({
  fetchSavedQueries: (api: Api, loggedInUser: LoggedInUser) =>
    dispatch(fetchSavedQueries(api, loggedInUser)),
  deleteParticularSavedQuery: (
    api: Api,
    queryId: string,
    loggedInUser: LoggedInUser,
    queryType: QueryType,
  ) => dispatch(deleteParticularSavedQuery(api, queryId, loggedInUser, queryType)),
});

const mapStateToProps = (state: RootState) => ({
  queries: selectSavedQueries(state),
  queryIdToStatus: selectSavedQueryIdToStatus(state),
  errorFetchAllQueries: selectErrorFetchAllSavedQueries(state),
  isLoadingAllQueries: selectIsLoadingAllSavedQueries(state),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & OwnProps;

const formatStat = (val: number | string) => (val || 0).toLocaleString();

const SavedQueries = (props: Props) => {
  const {
    errorFetchAllQueries,
    queries,
    queryIdToStatus,
    loggedInUser,
    deleteParticularSavedQuery,
    isLoadingAllQueries,
    fetchSavedQueries,
    api,
  } = props;
  const [activeTab, setActiveTab] = useState(TAB_KEY_COHORT_QUERIES);

  useEffect(() => {
    fetchSavedQueries(api, loggedInUser);
  }, [api, loggedInUser, fetchSavedQueries]);

  if (isLoadingAllQueries) {
    return (
      <Card size="small" title={<span className={'title-dashboard-card'}>My Saved Queries</span>}>
        <Spinner />
      </Card>
    );
  }

  if (errorFetchAllQueries) {
    return (
      <Card size="small" title={<span className={'title-dashboard-card'}>My Saved Queries</span>}>
        <Result
          status="error"
          title="Failed to Fetch Saved Queries"
          subTitle="Please refresh and try again or contact our support."
        />
      </Card>
    );
  }

  const tabList = [
    {
      key: TAB_KEY_COHORT_QUERIES,
      tab: (
        <div className={antCardHeader}>
          <span>Cohort Queries&nbsp;</span>
          <Badge count={queries.cohort.length} showZero />
        </div>
      ),
    },
    {
      key: TAB_KEY_FILES_QUERIES,
      tab: (
        <div className={antCardHeader}>
          <span>File Queries&nbsp;</span>
          <Badge count={queries.file.length} showZero />
        </div>
      ),
    },
  ];

  return (
    <div className={'saved-queries-container'}>
      <Card
        size="small"
        title={<span className={'title-dashboard-card'}>My Saved Queries</span>}
        tabList={tabList}
        tabProps={{ size: 'small' }}
        onTabChange={(key) => {
          setActiveTab(key);
        }}
        activeTabKey={activeTab}
      >
        {activeTab === TAB_KEY_COHORT_QUERIES && (
          <SavedQueriesTab
            items={queries.cohort}
            queryIdToStatus={queryIdToStatus}
            makeDescription={(item) => {
              const vs = item as VirtualStudyPlusId;
              return (
                <>
                  {vs.description.length >= 140
                    ? `${vs.description.slice(0, 140)}...`
                    : vs.description}
                </>
              );
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
        )}
        {activeTab === TAB_KEY_FILES_QUERIES && (
          <SavedQueriesTab
            items={queries.file}
            queryIdToStatus={queryIdToStatus}
            makeDescription={(item) => {
              const sq = item as SavedQueryWithFileContent;
              return (
                <Space>
                  <Space key={'file'}>
                    <FileOutlined /> {formatStat(sq?.content?.Files)} |
                  </Space>
                  <Space key={'participants'}>
                    <UserOutlined />
                    {formatStat(sq?.content?.Participants)} |
                  </Space>
                  <Space key={'families'}>
                    <UsergroupAddOutlined />
                    {formatStat(sq?.content?.Families)} |
                  </Space>
                  <Space key={'size'}>
                    <DatabaseOutlined />
                    {formatStat(sq?.content?.Size)}
                  </Space>
                </Space>
              );
            }}
            makeItemTitle={(item) => {
              const sq = item as SavedQueryWithFileContent;
              return (
                <a
                  onClick={async () => {
                    await trackUserInteraction({
                      value: undefined,
                      category: TRACKING_EVENTS.categories.user.dashboard.widgets.savedQueries,
                      action: `${TRACKING_EVENTS.actions.click} Saved Query Title`,
                      label: JSON.stringify(sq),
                    });
                  }}
                  href={`/search${sq.content.longUrl.split('/search')[1]}`}
                >
                  {sq.alias}
                </a>
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
        )}
      </Card>
    </div>
  );
};

export default connector(SavedQueries);
