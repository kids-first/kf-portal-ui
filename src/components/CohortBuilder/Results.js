import React from 'react';
import { compose, withState } from 'recompose';
import { withTheme } from 'emotion-theming';
import ContentBar from './ContentBar';
import Summary from './Summary';
import Row from 'uikit/Row';
import ViewLink from 'uikit/ViewLink';
import styled from 'react-emotion';
import { H2 } from 'uikit/Headings';
import Table from './Table';
import SummaryIcon from 'icons/AllAppsMenuIcon';
import TableViewIcon from 'icons/TableViewIcon';
import DemographicIcon from 'icons/DemographicIcon';
import FilesIcon from 'icons/FilesIcon';
import DoubleChevronRightIcon from 'icons/DoubleChevronRightIcon';

const SUMMARY = 'summary';
const TABLE = 'table';

const ViewLinks = styled(Row)`
  > div:not(:last-child) {
    margin-right: 30px;
  }
`;

const Left = styled(Row)`
  align-items: center;
`;

const Heading = styled(H2)`
  color: ${({theme}) => theme.secondary};
  margin-right: 20px;
`;

const ActiveView = styled('div')`
  width: 100%;
  padding: 0 30px;
`;

const SubHeading = styled('h3')`
  font-weight: ${({ fontWeight }) => (fontWeight ? fontWeight : 600)};
  font-family: ${({ theme }) => theme.default};
  font-size: 16px;
  color: ${({ color, theme }) => (color ? color : theme.secondary)};
  padding: 0 3px;
  margin: 0;
`;

const Results = ({ activeView, setActiveView, theme }) => (
  <React.Fragment>
    <ContentBar>
      <Left>
        <Heading>All data</Heading>

        <DemographicIcon />
        <SubHeading>{Number(1314).toLocaleString()} Participants</SubHeading>

        <FilesIcon />
        <SubHeading color={theme.purple}>{`View ${Number(2422).toLocaleString()} Files`}</SubHeading>
        <DoubleChevronRightIcon
          fill={theme.purple}
          height={7}
          style={{ position: 'relative', top: '1px', left: '2px' }}
        />
      </Left>
      <ViewLinks>
        <ViewLink onClick={() => setActiveView(SUMMARY)} active={activeView === SUMMARY}>
          <SummaryIcon marginRight={5} />
          Summary View
        </ViewLink>
        <ViewLink onClick={() => setActiveView(TABLE)} active={activeView === TABLE}>
          <TableViewIcon marginRight={5} />
          Table View
        </ViewLink>
      </ViewLinks>
    </ContentBar>
    <ActiveView>{activeView === SUMMARY ? <Summary /> : <Table />}</ActiveView>
  </React.Fragment>
);

export default compose(withTheme, withState('activeView', 'setActiveView', SUMMARY))(Results);
