import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import gql from 'graphql-tag';
import { compose } from 'recompose';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import { injectState } from 'freactal';
import saveSet from '@kfarranger/components/dist/utils/saveSet';

import Row from 'uikit/Row';
import ViewLink from 'uikit/ViewLink';
import { H2 } from 'uikit/Headings';
import SummaryIcon from 'icons/AllAppsMenuIcon';
import TableViewIcon from 'icons/TableViewIcon';
import DemographicIcon from 'icons/DemographicIcon';
import FilesIcon from 'icons/FilesIcon';
import familyMembers from 'assets/icon-families-grey.svg';

import { withApi } from 'services/api';
import graphql from 'services/arranger';

import TableErrorView from './ParticipantsTableView/TableErrorView';
import ParticipantsTableView from './ParticipantsTableView';
import QueriesResolver from './QueriesResolver';
import EmptyCohortOverlay from './EmptyCohortOverlay';
import { createFileRepoLink } from './util';
import ContentBar from './ContentBar';
import Summary from './Summary';
import { setActiveView } from './actionCreators';
import './Results.css';
import { Spin, notification } from 'antd';
import LinkWithLoader from '../../ui/LinkWithLoader';
import { CARDINALITY_PRECISION_THRESHOLD } from '../../common/constants';
import { roundIntToChosenPowerOfTen } from '../../utils';
import capitalize from 'lodash/capitalize';

const SUMMARY = 'summary';
const TABLE = 'table';
const LABELS = {
  participant: {
    singular: 'participant',
    plural: 'participants',
  },
  family: {
    singular: 'family',
    plural: 'families',
  },
  file: {
    singular: 'file',
    plural: 'files',
  },
};

const formatCountResult = (cardinality, labelKey) => {
  const isZero = cardinality === 0;
  if (isZero) {
    return `No ${capitalize(LABELS[labelKey].singular)}`;
  }

  const hasMany = cardinality > 1;
  const label = hasMany
    ? capitalize(LABELS[labelKey].plural)
    : capitalize(LABELS[labelKey].singular);

  const isApproximation =
    cardinality >= CARDINALITY_PRECISION_THRESHOLD && labelKey !== 'participant';
  if (isApproximation) {
    const approxSymbol = '\u2248';
    return `${approxSymbol} ${roundIntToChosenPowerOfTen(cardinality)} ${label}`;
  }
  return `${cardinality} ${label}`;
};

const showErrorNotification = () =>
  notification.error({
    message: 'Error',
    description: 'Unable to create a link to access file repository',
  });

const generateAllFilesLink = async (user, api, originalSqon) => {
  try {
    const fileSet = await saveSet({
      type: 'participant',
      sqon: originalSqon || {},
      userId: user.egoId,
      path: 'kf_id',
      api: graphql(api),
    });

    const setId = get(fileSet, 'data.saveSet.setId');

    return createFileRepoLink({
      op: 'and',
      content: [
        {
          op: 'in',
          content: {
            field: 'participants.kf_id',
            value: `set_id:${setId}`,
          },
        },
      ],
    });
  } catch (e) {
    showErrorNotification();
  }
};

const cohortResultsQuery = sqon => ({
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
  transform: data => {
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

const Results = ({
  activeView,
  activeSqonIndex,
  setActiveView,
  sqon = { op: 'and', content: [] },
  api,
  state,
}) => (
  <QueriesResolver name={'GQL_RESULT_QUERIES'} api={api} queries={[cohortResultsQuery(sqon)]}>
    {({ isLoading, data, error }) => {
      if (error) {
        return <TableErrorView error={error} />;
      }

      const resultsData = data[0];

      const participantCount = get(resultsData, 'participantCount', null);
      const familiesCount = get(resultsData, 'familiesCountCardinality', null);
      const cohortIsEmpty = (!isLoading && !resultsData) || participantCount === 0;
      const filesCardinality = get(resultsData, 'filesCardinality', 0);

      const hasNoFile = filesCardinality === 0;
      const hasNoCohortQuery = isEmpty(sqon.content);

      const showDetailsHeader = () => {
        if (hasNoCohortQuery) {
          return <H2>All Data</H2>;
        }
        return (
          <Fragment>
            <H2>Cohort Results</H2>
            <h3 className="cb-sub-heading" style={{ fontWeight: 'normal', marginRight: '10px' }}>
              for Query {activeSqonIndex + 1}
            </h3>
          </Fragment>
        );
      };

      return (
        <Fragment>
          <ContentBar style={{ padding: '0 30px 0 34px' }}>
            <Row className="cb-view-links">
              <ViewLink
                onClick={() => setActiveView(SUMMARY)}
                active={activeView === SUMMARY}
                Icon={SummaryIcon}
              >
                Summary View
              </ViewLink>
              <ViewLink
                onClick={() => setActiveView(TABLE)}
                active={activeView === TABLE}
                Icon={TableViewIcon}
              >
                Table View
              </ViewLink>
            </Row>
            <Row className="cb-detail">
              {showDetailsHeader()}
              {isLoading ? (
                <div className={'cb-summary-is-loading'}>
                  <Spin size={'small'} />
                </div>
              ) : (
                <div className="cb-summary">
                  <div className="cb-summary-entity">
                    <h3 className="cb-sub-heading">
                      <DemographicIcon width="14px" height="17px" />
                      {formatCountResult(participantCount, 'participant')}
                    </h3>
                  </div>
                  <div className="cb-summary-entity">
                    <h3 className="cb-sub-heading">
                      <img src={familyMembers} alt="" height="13px" />
                      {formatCountResult(familiesCount, 'family')}
                    </h3>
                  </div>
                  <div className="cb-summary-entity">
                    <h3 className="cb-sub-heading-without-count">
                      <div className="cb-summary-files">
                        {hasNoFile ? (
                          <div>
                            <FilesIcon style={{ marginRight: '6px' }} /> {'No File'}
                          </div>
                        ) : (
                          <Fragment>
                            <div>
                              <FilesIcon />
                              <LinkWithLoader
                                linkClassname="cb-purple-link cb-sub-heading-without-count"
                                getLink={
                                  hasNoCohortQuery
                                    ? () => '/search/file'
                                    : () => generateAllFilesLink(state.loggedInUser, api, sqon)
                                }
                              >
                                {formatCountResult(filesCardinality, 'file')}
                              </LinkWithLoader>
                            </div>
                          </Fragment>
                        )}
                      </div>
                    </h3>
                  </div>
                </div>
              )}
            </Row>
          </ContentBar>
          <div className={`cb-active-view ${activeView}`}>
            <Summary sqon={sqon} />
            <ParticipantsTableView sqon={sqon} loggedInUser={state.loggedInUser} />
            {cohortIsEmpty ? <EmptyCohortOverlay /> : null}
          </div>
        </Fragment>
      );
    }}
  </QueriesResolver>
);

Results.propTypes = {
  activeSqonIndex: PropTypes.number.isRequired,
  sqon: PropTypes.object,
  setActiveView: PropTypes.func.isRequired,
  activeView: PropTypes.string.isRequired,
  api: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  const { activeView } = state.ui.cohortBuilderPage;
  return {
    activeView,
  };
};

const mapDispatchToProps = {
  setActiveView,
};

export default compose(withApi, injectState, connect(mapStateToProps, mapDispatchToProps))(Results);
