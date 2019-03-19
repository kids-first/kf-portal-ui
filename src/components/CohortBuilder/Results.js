import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState } from 'recompose';
import { withTheme } from 'emotion-theming';
import ContentBar from './ContentBar';
import Summary from './Summary';
import Row from 'uikit/Row';
import ViewLink from 'uikit/ViewLink';
import styled, { css } from 'react-emotion';
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
import { isEmpty } from 'lodash';
import LinkWithLoader from 'uikit/LinkWithLoader';
import { createFileRepoLink } from './util';
import { injectState } from 'freactal';
import saveSet from '@arranger/components/dist/utils/saveSet';
import graphql from 'services/arranger';
import { get } from 'lodash';

const SUMMARY = 'summary';
const TABLE = 'table';

const ViewLinks = styled(Row)`
  > div:not(:last-child) {
    margin-right: 30px;
  }
`;

const Detail = styled(Row)`
  align-items: center;
`;

const Heading = styled(H2)`
  color: ${({ theme }) => theme.secondary};
`;

const ActiveView = styled('div')`
  width: 100%;
  padding: 0 26px 36px 26px;
  margin-top: 19px;
  position: relative;

  ${({ activeView }) =>
    activeView === SUMMARY
      ? css`
          > div:nth-child(2) {
            display: none !important;
          }
        `
      : css`
          > div:first-child {
            display: none !important;
          }
        `}
`;

const SubHeadingStyle = props => {
  const { fontWeight, theme } = props;
  return css`
    font-weight: ${fontWeight ? fontWeight : 600};
    font-family: ${theme.default};
    font-size: 16px;
    padding: 0 3px;
    margin: 0;
  `;
};

const SubHeading = styled('h3')`
${SubHeadingStyle}
  color: ${({ color, theme }) => (color ? color : theme.secondary)};
`;

const PurpleLinkWithLoader = styled(LinkWithLoader)`
  ${SubHeadingStyle};
  color: ${({ theme }) => theme.purple};
  &:hover {
    color: ${({ theme }) => theme.linkPurple};
  }
`;

const ResultsHeading = styled('div')`
  display: flex;
  padding: 0 20px 3px 0;
  border-right: 1px solid ${({ theme }) => theme.greyScale11};
  margin-right: 14px;
`;

const Content = styled(ContentBar)`
  padding: 0 30px 0 34px;
`;

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
  query: `query ($sqon: JSON) {
    participant {
      hits(filters: $sqon) {
        total
      }
      aggregations(filters: $sqon) {
        files__kf_id {
          buckets {
            key
          }
        }
      }
    }
  }`,
  variables: { sqon },
  transform: data => {
    const participants = get(data, 'data.participant.hits.total', 0);
    const files = get(data, 'data.participant.aggregations.files__kf_id.buckets', []).map(
      b => b.key,
    );
    return {
      files,
      participantCount: participants,
      filesCount: files.length,
    };
  },
});

const Results = ({
  activeView,
  activeSqonIndex,
  setActiveView,
  theme,
  sqon,
  api,
  state,
  onRemoveFromCohort,
}) => (
  <QueriesResolver name="GQL_RESULT_QUERIES" api={api} queries={[cohortResultsQuery(sqon)]}>
    {({ isLoading, data, error }) => {
      const cohortIsEmpty =
        !data[0] || (data[0].participantCount === 0 || data[0].filesCount === 0);
      return isLoading ? (
        <Row nogutter>
          <div className={theme.fillCenter} style={{ marginTop: '30px' }}>
            <LoadingSpinner color={theme.greyScale11} size={'50px'} />
          </div>
        </Row>
      ) : error ? (
        <TableErrorView error={error} />
      ) : (
        <React.Fragment>
          <Content>
            <Detail>
              <ResultsHeading>
                {!sqon || isEmpty(sqon.content) ? (
                  <Heading>All Data</Heading>
                ) : (
                  <React.Fragment>
                    <Heading>Cohort Results</Heading>
                    <SubHeading fontWeight={'normal'}>for Query {activeSqonIndex + 1}</SubHeading>
                  </React.Fragment>
                )}
              </ResultsHeading>{' '}
              <DemographicIcon />
              <SubHeading>
                {Number(data[0].participantCount || 0).toLocaleString()} Participants with{' '}
              </SubHeading>
              <PurpleLinkWithLoader
                getLink={() => generateAllFilesLink(state.loggedInUser, api, data[0].files)}
              >
                {`${Number(data[0].filesCount || 0).toLocaleString()} Files`}
              </PurpleLinkWithLoader>
            </Detail>
            <ViewLinks>
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
            </ViewLinks>
          </Content>
          <ActiveView activeView={activeView}>
            <Summary sqon={sqon} />
            <ParticipantsTableView sqon={sqon} onRemoveFromCohort={onRemoveFromCohort} />
            {cohortIsEmpty ? <EmptyCohortOverlay /> : null}
          </ActiveView>
        </React.Fragment>
      );
    }}
  </QueriesResolver>
);

Results.propTypes = {
  activeSqonIndex: PropTypes.number.isRequired,
  sqon: PropTypes.object.isRequired,
  onRemoveFromCohort: PropTypes.func.isRequired,
};

export default compose(
  withTheme,
  withApi,
  injectState,
  withState('activeView', 'setActiveView', SUMMARY),
)(Results);
