import React from 'react';
import { compose, withState } from 'recompose';
import ContentSection from './ContentSection';
import ContentBar from './ContentBar';
import Summary from './Summary';
import Row from 'uikit/Row';
import ViewLink from 'uikit/ViewLink';
import styled from 'react-emotion';
import { H2 } from 'uikit/Headings';
import Table from './Table';
import SummaryIcon from 'icons/AllAppsMenuIcon';
import TableViewIcon from 'icons/TableViewIcon';

const SUMMARY = 'summary';
const TABLE = 'table';

const ViewLinks = styled(Row)`
  > div:not(:last-child) {
    margin-right: 30px;
  }
`;

const Left = styled(Row)``;

const Heading = styled(H2)`
  color: #2b388f;
`;

const ActiveView = styled('div')`
  width: 100%;
  padding: 0 30px;
`;

const Results = ({ activeView, setActiveView }) => (
  <React.Fragment>
    <ContentBar>
      <Left>
        <Heading>All data</Heading>
        <div>23232 Participants</div>
        <div> View 24242,222 Files</div>
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

export default compose(withState('activeView', 'setActiveView', SUMMARY))(Results);
