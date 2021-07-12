import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import Card from '@ferlab/ui/core/view/GridCard';
import { Badge, Result } from 'antd';

import { deleteParticularSavedQuery, fetchSavedQueries } from 'store/actionCreators/SavedQueries';
import { Api } from 'store/apiTypes';
import { RootState } from 'store/rootState';
import { DispatchSavedQueries, QueryType } from 'store/SavedQueriesTypes';
import {
  selectErrorFetchAllSavedQueries,
  selectIsLoadingAllSavedQueries,
  selectSavedQueries,
  selectSavedQueryIdToStatus,
} from 'store/selectors/savedQueries';
import { LoggedInUser } from 'store/userTypes';
import { Spinner } from 'uikit/Spinner';

import CohortTab from './CohortTab';
import FileTab from './FileTab';

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
          <CohortTab
            loggedInUser={loggedInUser}
            api={api}
            deleteParticularSavedQuery={deleteParticularSavedQuery}
            queries={queries}
            queryIdToStatus={queryIdToStatus}
          />
        )}
        {activeTab === TAB_KEY_FILES_QUERIES && (
          <FileTab
            loggedInUser={loggedInUser}
            api={api}
            deleteParticularSavedQuery={deleteParticularSavedQuery}
            queries={queries}
            queryIdToStatus={queryIdToStatus}
          />
        )}
      </Card>
    </div>
  );
};

export default connector(SavedQueries);
