import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { compose } from 'recompose';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

import ContentBar from './ContentBar';
import Summary from './Summary';
import Row from 'uikit/Row';
import ViewLink from 'uikit/ViewLink';
import { H2 } from 'uikit/Headings';
import ParticipantsTableView from './ParticipantsTableView';
import SummaryIcon from 'icons/AllAppsMenuIcon';
import TableViewIcon from 'icons/TableViewIcon';
import DemographicIcon from 'icons/DemographicIcon';
import { withApi } from 'services/api';
import TableErrorView from './ParticipantsTableView/TableErrorView';
import QueriesResolver from './QueriesResolver';
import LoadingSpinner from 'uikit/LoadingSpinner';
import EmptyCohortOverlay from './EmptyCohortOverlay';
import LinkWithLoader from 'uikit/LinkWithLoader';
import { createFileRepoLink } from './util';
import { injectState } from 'freactal';
import saveSet from '@kfarranger/components/dist/utils/saveSet';
import graphql from 'services/arranger';
import FilesIcon from 'icons/FilesIcon';
import familyMembers from 'assets/icon-families-grey.svg';
import { setActiveView } from './actionCreators';

import { styleComponent } from 'components/Utils';

import './Results.css';

const SUMMARY = 'summary';
const TABLE = 'table';

const PurpleLinkWithLoader = styleComponent(LinkWithLoader, 'cb-purple-link cb-sub-heading');
const PurpleLink = styleComponent(Link, 'cb-purple-link cb-sub-heading');

const generateAllFilesLink = async (user, api, files) => {
  const sqon = {
    op: 'and',
    content: [
      {
        op: 'in',
        content: { field: 'kf_id', value: files },
      },
    ],
  };

  const fileSet = await saveSet({
    type: 'file',
    sqon: sqon || {},
    userId: user.egoId,
    path: 'kf_id',
    api: graphql(api),
  });

  const setId = get(fileSet, 'data.saveSet.setId');

  const fileSqon = {
    op: 'and',
    content: [
      {
        op: 'in',
        content: {
          field: 'kf_id',
          value: `set_id:${setId}`,
        },
      },
    ],
  };

  const fileRepoLink = createFileRepoLink(fileSqon);
  return fileRepoLink;
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
            buckets {
              key
            }
          }
        }
        aggregations(filters: $sqon, aggregations_filter_themselves: true) {
          family_id {
            buckets {
              doc_count
              key
            }
          }
        }
      }
    }
  `,

  variables: { sqon },
  transform: data => {
    const participants = get(data, 'data.participant.hits.total', 0);
    const files = get(data, 'data.participant.aggregations.files__kf_id.buckets', []).map(
      b => b.key,
    );
    const families = get(data, 'data.participant.aggregations.family_id.buckets', []);
    return {
      files,
      participantCount: participants,
      filesCount: files.length,
      familiesCount: families.filter(item => item.key !== '__missing__').length,
    };
  },
});

class Results extends React.Component {
  static propTypes = {
    activeSqonIndex: PropTypes.number.isRequired,
    sqon: PropTypes.object,
    onRemoveFromCohort: PropTypes.func.isRequired,
    setActiveView: PropTypes.func.isRequired,
    activeView: PropTypes.string.isRequired,
  };

  render() {
    const {
      activeView,
      activeSqonIndex,
      setActiveView,
      sqon = { op: 'and', content: [] },
      api,
      state,
      onRemoveFromCohort,
    } = this.props;

    return (
      <QueriesResolver name="GQL_RESULT_QUERIES" api={api} queries={[cohortResultsQuery(sqon)]}>
        {({ isLoading, data, error }) => {
          const resultsData = data[0];
          const participantCount = get(resultsData, 'participantCount', null);
          const familiesCount = get(resultsData, 'familiesCount', null);
          const cohortIsEmpty = (!isLoading && !resultsData) || participantCount === 0;

          const filesCountHeading = resultsData
            ? `${Number(data[0].filesCount || 0).toLocaleString()}`
            : '';

          const hasNoFile = resultsData ? data[0].filesCount === 0 : true;

          return error ? (
            <TableErrorView error={error} />
          ) : (
            <React.Fragment>
              <ContentBar style={{ padding: '0 30px 0 34px' }}>
                <Row className="cb-detail">
                  <div style={{ display: 'flex', marginRight: '14px' }}>
                    {isEmpty(sqon.content) ? (
                      <H2>All Data</H2>
                    ) : (
                      <React.Fragment>
                        <H2>Cohort Results</H2>
                        <h3 className="cb-sub-heading" style={{ fontWeight: 'normal' }}>
                          for Query {activeSqonIndex + 1}
                        </h3>
                      </React.Fragment>
                    )}
                  </div>{' '}
                  {isLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <div className="cb-summary">
                      <div className="cb-summary-entity">
                        <h3 className="cb-sub-heading">
                          <DemographicIcon width="14px" height="17px" />
                          {Number(participantCount || 0).toLocaleString()}{' '}
                          {participantCount === 1 ? 'Participant' : 'Participants'}
                        </h3>
                      </div>
                      <div className="cb-summary-entity">
                        <h3 className="cb-sub-heading">
                          <img src={familyMembers} alt="" height="13px" />{' '}
                          {Number(familiesCount || 0).toLocaleString()}{' '}
                          {familiesCount === 1 ? 'Family' : 'Families'}
                        </h3>
                      </div>
                      <div className="cb-summary-entity">
                        <h3 className="cb-sub-heading">
                          <div className="cb-summary-files">
                            {hasNoFile ? (
                              <div>
                                <FilesIcon style={{ marginRight: '6px' }} /> {'0 File'}
                              </div>
                            ) : (
                              <React.Fragment>
                                <div>
                                  <FilesIcon />
                                  {isEmpty(sqon.content) ? (
                                    <PurpleLink to="/search/file">{filesCountHeading} </PurpleLink>
                                  ) : (
                                    <PurpleLinkWithLoader
                                      replaceText={false}
                                      getLink={() =>
                                        generateAllFilesLink(state.loggedInUser, api, data[0].files)
                                      }
                                    >
                                      {filesCountHeading}
                                    </PurpleLinkWithLoader>
                                  )}
                                </div>
                                <div>Files</div>
                              </React.Fragment>
                            )}
                          </div>
                        </h3>
                      </div>
                    </div>
                  )}
                </Row>

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
              </ContentBar>
              <div className={`cb-active-view ${activeView}`}>
                <Summary sqon={sqon} />
                <ParticipantsTableView sqon={sqon} onRemoveFromCohort={onRemoveFromCohort} />
                {cohortIsEmpty ? <EmptyCohortOverlay /> : null}
              </div>
            </React.Fragment>
          );
        }}
      </QueriesResolver>
    );
  }
}

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
