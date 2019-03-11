import React from 'react';
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
import { Link } from 'uikit/Core';
import { withApi } from 'services/api';
import { cohortResults } from './ParticipantsTableView/queries';
import TableErrorView from './ParticipantsTableView/TableErrorView';
import QueriesResolver from './QueriesResolver';
import LoadingSpinner from 'uikit/LoadingSpinner';
import EmptyCohortOverlay from './EmptyCohortOverlay';
import { isEmpty } from 'lodash';
import LinkWithLoader from 'uikit/LinkWithLoader';

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

const Results = ({ activeView, activeSqonIndex, setActiveView, theme, sqon, api }) => (
  <QueriesResolver name="GQL_RESULT_QUERIES" api={api} queries={[cohortResults(sqon)]}>
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
              <PurpleLinkWithLoader>
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
          <ActiveView>
            {activeView === SUMMARY ? (
              <Summary sqon={sqon} />
            ) : (
              <ParticipantsTableView sqon={sqon} />
            )}
            {cohortIsEmpty ? <EmptyCohortOverlay /> : null}
          </ActiveView>
        </React.Fragment>
      );
    }}
  </QueriesResolver>
);

export default compose(
  withTheme,
  withApi,
  withState('activeView', 'setActiveView', SUMMARY),
)(Results);
