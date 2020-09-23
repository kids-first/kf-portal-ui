import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { compose } from 'recompose';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

import { injectState } from 'freactal';
import Row from 'uikit/Row';
import { AppstoreFilled, TableOutlined } from '@ant-design/icons';

import { Tabs } from 'antd';

import { withApi } from 'services/api';

import TableErrorView from './ParticipantsTableView/TableErrorView';
import ParticipantsTableView from './ParticipantsTableView';
import QueriesResolver from './QueriesResolver';
import EmptyCohortOverlay from './EmptyCohortOverlay';
import Summary from './Summary';

import { CARDINALITY_PRECISION_THRESHOLD } from 'common/constants';
import Toolbar from './Results/Toolbar/Toolbar';

import './Results.css';

const { TabPane } = Tabs;
const SUMMARY = 'summary';
const TABLE = 'table';

const cohortResultsQuery = (sqon) => ({
  query: gql`
        query($sqon: JSON) {
          participant {
            hits(filters: $sqon) {
              total
            }
            aggregations(filters: $sqon, aggregations_filter_themselves: true) {
              files__kf_id {
                cardinality(precision_threshold: ${CARDINALITY_PRECISION_THRESHOLD})
              }
            }
            aggregations(filters: $sqon, aggregations_filter_themselves: true) {
              family_id {
                cardinality(precision_threshold: ${CARDINALITY_PRECISION_THRESHOLD})
              }
            }
          }
        }
      `,
  variables: { sqon },
  transform: (data) => {
    const participantCount = get(data, 'data.participant.hits.total', 0);
    const filesCardinality = data?.data?.participant?.aggregations?.files__kf_id?.cardinality || 0;
    const familiesCountCardinality =
      data?.data?.participant?.aggregations?.family_id?.cardinality || 0;
    return {
      participantCount,
      filesCardinality,
      familiesCountCardinality,
    };
  },
});

const Results = ({ activeSqonIndex, sqon = { op: 'and', content: [] }, api, state }) => (
  <QueriesResolver name={'GQL_RESULT_QUERIES'} api={api} queries={[cohortResultsQuery(sqon)]}>
    {({ isLoading, data, error }) => {
      if (error) {
        return <TableErrorView error={error} />;
      }

      const resultsData = data[0];
      const isFiltered = !isEmpty(sqon.content);

      const participantCount = get(resultsData, 'participantCount', null);
      const cohortIsEmpty = (!isLoading && !resultsData) || participantCount === 0;

      const toolbar = (
        <Toolbar
          {...{
            api,
            isLoading,
            data: data[0],
            participantCount,
            isFiltered,
            activeSqonIndex,
            egoGroups: state.egoGroups,
            sqon,
            loggedInUser: state.loggedInUser,
          }}
        />
      );

      return (
        <Fragment>
          <div style={{ padding: '0 30px 0 34px' }} className="cb-view-links">
            <Tabs
              tabBarExtraContent={toolbar}
              type="card"
              style={{ marginBottom: '0px' }}
              tabBarStyle={{ marginBottom: '0px' }}
            >
              <TabPane
                tab={
                  <span>
                    <AppstoreFilled />
                    Summary View
                  </span>
                }
                key={SUMMARY}
                className="cb-tab-content cb-tab-content-summary"
              >
                <Summary sqon={sqon} />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <TableOutlined />
                    Table View
                  </span>
                }
                key={TABLE}
                className="cb-tab-content"
              >
                {cohortIsEmpty ? <EmptyCohortOverlay /> : null}
                <ParticipantsTableView sqon={sqon} />
              </TabPane>
            </Tabs>
          </div>
          <Row className="cb-detail"></Row>
          {}
        </Fragment>
      );
    }}
  </QueriesResolver>
);

Results.propTypes = {
  activeSqonIndex: PropTypes.number.isRequired,
  sqon: PropTypes.object,
  api: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
};

export default compose(withApi, injectState)(Results);
