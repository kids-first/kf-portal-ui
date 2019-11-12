import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import autobind from 'auto-bind-es5';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TrashIcon from 'react-icons/lib/fa/trash';
import { distanceInWords } from 'date-fns';
import { Box, Link, Flex, Span } from 'uikit/Core';
import CardHeader from 'uikit/Card/CardHeader';
import Row from 'uikit/Row';
import Column from 'uikit/Column';
import Tooltip from 'uikit/Tooltip';

import { Tabs, ShowIf } from 'components/FileRepo/AggregationSidebar/CustomAggregationsPanel';
import {
  PromptMessageContainer,
  PromptMessageContent,
  CardContentSpinner,
  DashboardCard,
} from '../styles';
import QueryBlock from './QueryBlock';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import {
  fetchVirtualStudiesCollection,
  deleteVirtualStudy,
} from '../../../store/actionCreators/virtualStudies';
import { setActiveSavedQueryTab } from '../actionCreators';
import provideSavedQueries from 'stateProviders/provideSavedQueries';
import { styleComponent } from 'components/Utils';

import {
  savedQueriesContainer,
  study,
  studyLink,
  studyDeleteWrapper,
  scrollY,
  studyDescription,
  studySavedTime,
} from './SavedQueries.module.css';

const FileRepositoryLink = styleComponent(Link, 'color-primary');
const Scroll = styleComponent('div', scrollY);

class SavedQueries extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  static propTypes = {
    // from redux store
    virtualStudies: PropTypes.array.isRequired,
    userDashboardPage: PropTypes.object.isRequired,
    // from freactal state
    state: PropTypes.shape({
      queries: PropTypes.array.isRequired,
      exampleQueries: PropTypes.array.isRequired,
      loadingQueries: PropTypes.bool.isRequired,
      deletingIds: PropTypes.array.isRequired,
    }).isRequired,
    effects: PropTypes.shape({
      getQueries: PropTypes.func.isRequired,
    }),
  };

  componentDidMount() {
    const { api } = this.props;
    this.props.effects.getQueries({ egoId: this.props.loggedInUser.egoId, api });
    this.props.fetchVirtualStudiesCollection(this.props.loggedInUser.egoId);
  }

  deleteVirtualStudy(vs) {
    trackUserInteraction({
      category: TRACKING_EVENTS.categories.user.dashboard.widgets.savedVirtualStudies,
      action: TRACKING_EVENTS.actions.query.delete,
      label: JSON.stringify(vs),
    });
    this.props.deleteVirtualStudy({
      virtualStudyId: vs.virtualStudyId,
      loggedInUser: this.props.loggedInUser,
    });
  }

  render() {
    const {
      state: { queries: fileQueries, exampleQueries, loadingQueries, deletingIds },
      virtualStudies,
      userDashboardPage,
      setActiveSavedQueryTab,
    } = this.props;
    const selectedTab = userDashboardPage.activeSavedQueryTab;
    return (
      <DashboardCard showHeader={false}>
        {loadingQueries ? (
          <CardContentSpinner />
        ) : (
          <div>
            <CardHeader title="Saved Queries" style={{ margin: '5px 0 15px 0' }} />
            <Column className={savedQueriesContainer}>
              <Tabs
                selectedTab={selectedTab}
                options={[
                  {
                    id: 'PARTICIPANTS',
                    display: 'Participants',
                    total: virtualStudies.length ? virtualStudies.length : [0],
                  },
                  {
                    id: 'FILES',
                    display: 'Files',
                    total: fileQueries.length ? fileQueries.length : [0],
                  },
                ]}
                onTabSelect={({ id }) => {
                  setActiveSavedQueryTab(id);
                }}
              />
              <ShowIf condition={selectedTab === 'FILES'}>
                {!fileQueries.length ? (
                  <Scroll>
                    <Box mt={2}>
                      <PromptMessageContainer info mb={'8px'}>
                        <PromptMessageContent>
                          Explore the{' '}
                          <FileRepositoryLink to="/search/file">File Repository</FileRepositoryLink>{' '}
                          to save queries!
                        </PromptMessageContent>
                      </PromptMessageContainer>
                    </Box>
                    <Box mt={2} mb={2}>
                      {exampleQueries.map(q => {
                        q.link = `/search${q.content.longUrl.split('/search')[1]}`;
                        return (
                          <QueryBlock
                            key={q.id}
                            query={q}
                            inactive={deletingIds.includes(q.id)}
                            savedTime={false}
                          />
                        );
                      })}
                    </Box>
                  </Scroll>
                ) : (
                  <Scroll>
                    <Box mt={2} mb={2}>
                      {fileQueries
                        .filter(q => q.alias && q.content.Files)
                        .map(q => ({
                          ...q,
                          date: Number(new Date(q.creationDate)),
                          link: `/search${q.content.longUrl.split('/search')[1]}`,
                        }))
                        .slice()
                        .sort((a, b) => b.date - a.date)
                        .map(q => (
                          <QueryBlock key={q.id} query={q} inactive={deletingIds.includes(q.id)} />
                        ))}
                    </Box>
                  </Scroll>
                )}
              </ShowIf>
              <ShowIf condition={selectedTab === 'PARTICIPANTS'}>
                {!virtualStudies.length ? (
                  <Box mt={2}>
                    <PromptMessageContainer info mb={'8px'}>
                      <PromptMessageContent>
                        <FileRepositoryLink to="/explore">Explore Data</FileRepositoryLink> and save
                        virtual studies!
                      </PromptMessageContent>
                    </PromptMessageContainer>
                  </Box>
                ) : (
                  <Box mt={2} mb={2}>
                    <Scroll>
                      {virtualStudies
                        .map(vs => (
                          <Flex
                            className={study}
                            key={vs.virtualStudyId}
                            date={Number(new Date(vs.creationDate))}
                          >
                            <Column width="100%">
                              <Row justifyContent="space-between" width="100%">
                                <Link className={studyLink} to={`/explore?id=${vs.virtualStudyId}`}>
                                  {vs.name}
                                </Link>
                                <Box pr={2} pl={2}>
                                  <span
                                    className={studyDeleteWrapper}
                                    onClick={() => {
                                      this.deleteVirtualStudy(vs);
                                    }}
                                  >
                                    <TrashIcon />
                                  </span>
                                </Box>
                              </Row>
                              <Row justifyContent="space-between" width="100%">
                                <Tooltip
                                  html={<div className={studyDescription}>{vs.description}</div>}
                                >
                                  <div className={studyDescription} style={{ marginRight: '32px' }}>
                                    {vs.description.length >= 140
                                      ? `${vs.description.slice(0, 140)}...`
                                      : vs.description}
                                  </div>
                                </Tooltip>
                              </Row>
                              <div
                                className={studySavedTime}
                                style={{ fontFamily: 'Open Sans,sans-serif' }}
                              >
                                Saved {distanceInWords(new Date(), new Date(vs.creationDate))} ago
                              </div>
                            </Column>
                          </Flex>
                        ))
                        .slice()
                        .sort((a, b) => b.props.date - a.props.date)}
                    </Scroll>
                  </Box>
                )}
              </ShowIf>
            </Column>
          </div>
        )}
      </DashboardCard>
    );
  }
}

const mapDispatchToProps = {
  fetchVirtualStudiesCollection,
  deleteVirtualStudy,
  setActiveSavedQueryTab,
};

const mapStateToProps = state => {
  const { virtualStudies, ui } = state;
  return {
    virtualStudies: virtualStudies.studies,
    userDashboardPage: ui.userDashboardPage,
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  provideSavedQueries,
  injectState,
)(SavedQueries);
