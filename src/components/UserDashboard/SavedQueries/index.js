import React from 'react';
import styled, { css } from 'react-emotion';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import autobind from 'auto-bind-es5';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TrashIcon from 'react-icons/lib/fa/trash';
import { withTheme } from 'emotion-theming';
import { distanceInWords } from 'date-fns';
import { Box, Link, Flex, Span } from 'uikit/Core';
import CardHeader from 'uikit/Card/CardHeader';
import Row from 'uikit/Row';
import Column from 'uikit/Column';
import Tooltip from 'uikit/Tooltip';

import { Tabs, ShowIf } from 'components/FileRepo/AggregationSidebar/CustomAggregationsPanel';

import { PromptMessageContainer, PromptMessageContent } from '../styles';
import { CardContentSpinner } from '../styles';
import { DashboardCard } from '../styles';
import QueryBlock from './QueryBlock';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

import {
  fetchVirtualStudiesCollection,
  deleteVirtualStudy,
} from '../../../store/actionCreators/virtualStudies';
import { setActiveSavedQueryTab } from '../actionCreators';

import provideSavedQueries from 'stateProviders/provideSavedQueries';

const Container = styled(Column)`
  margin: 0 0 15px 0;
  flex: 3;
  border-top: 0;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
`;

const FileRepositoryLink = styled(Link)`
  color: ${({ theme }) => theme.primary};
`;

const Study = styled(Flex)`
  padding: 10px 10px 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.greyScale5};
  transition-property: opacity;
  ${({ inactive, theme }) =>
    inactive
      ? `
          opacity: 0.6;
          pointer-events: none;
          &:last-child {
            border-bottom: 1px solid ${({ theme }) => theme.greyScale5};
          }
        `
      : ``};
`;

const StudyLink = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.details};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
`;

const Scroll = styled('div')`
  position: absolute;
  top: 83px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  overflow-x: hidden;
`;

const studyDescriptionStyle = css({
  fontSize: '12px',
  fontFamily: 'Open Sans, sans-serif',
  wordBreak: 'break-word',
});

const studySavedTimeStyle = css({
  fontSize: '12px',
  color: 'rgb(52,52,52)',
});

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
      theme,
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
            <Container>
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
                          <Study key={vs.virtualStudyId} date={Number(new Date(vs.creationDate))}>
                            <Column width="100%">
                              <Row justifyContent="space-between" width="100%">
                                <StudyLink to={`/explore?id=${vs.virtualStudyId}`}>
                                  {vs.name}
                                </StudyLink>
                                <Box pr={2} pl={2}>
                                  <Span
                                    color={theme.primary}
                                    hover={{ cursor: 'pointer', color: theme.hover }}
                                    onClick={() => {
                                      this.deleteVirtualStudy(vs);
                                    }}
                                  >
                                    <TrashIcon />
                                  </Span>
                                </Box>
                              </Row>
                              <Row justifyContent="space-between" width="100%">
                                <Tooltip
                                  html={
                                    <div className={`${studyDescriptionStyle}`}>
                                      {vs.description}
                                    </div>
                                  }
                                >
                                  <div
                                    className={`${studyDescriptionStyle}`}
                                    style={{ marginRight: '32px' }}
                                  >
                                    {vs.description.length >= 140
                                      ? `${vs.description.slice(0, 140)}...`
                                      : vs.description}
                                  </div>
                                </Tooltip>
                              </Row>
                              <div
                                className={`${studySavedTimeStyle}`}
                                style={{ fontFamily: 'Open Sans,sans-serif' }}
                              >
                                Saved {distanceInWords(new Date(), new Date(vs.creationDate))} ago
                              </div>
                            </Column>
                          </Study>
                        ))
                        .slice()
                        .sort((a, b) => b.props.date - a.props.date)}
                    </Scroll>
                  </Box>
                )}
              </ShowIf>
            </Container>
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
  withTheme,
)(SavedQueries);
