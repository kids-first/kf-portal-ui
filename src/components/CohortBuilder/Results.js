import React from 'react';
import { compose, withState } from 'recompose';
import ContentSection from './ContentSection';
import ContentBar from './ContentBar';
import Summary from './Summary';

const SUMMARY = 'summary';
const TABLE = 'table';

const Results = ({ activeView, setActiveView }) => (
  <ContentSection>
    <ContentBar>
      <div>
        <h2>Cohort Results</h2>
        <div>23232 Participants</div>
        <div> View 24242,222 Files</div>
      </div>
      <div>
        <div onClick={() => setActiveView(SUMMARY)}>Summary View</div>
        <div onClick={() => setActiveView(TABLE)}>Table View</div>
      </div>
    </ContentBar>
    {activeView === SUMMARY ? <Summary /> : <div>Tabel</div>}
  </ContentSection>
);

export default compose(withState('activeView', 'setActiveView', SUMMARY))(Results);
