import React from 'react';
import styled from 'react-emotion';
import Column from 'uikit/Column';
import Categories from './Categories';
import ContentSection from './ContentSection';
import ContentBar from './ContentBar';

const Container = styled(Column)`
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
`;

const CohortBuilder = () => (
  <Container>
    <ContentSection>
      <ContentBar>
        <div>
          <h1>Explore Data</h1>
          <button>load virtual study</button>
        </div>
        <div>
          <button>Save virtual study</button>
          <button>Share</button>
        </div>
      </ContentBar>
      <Categories />
    </ContentSection>
    <ContentSection>
      <div>
        <h2>Cohort Results</h2>
        <div>23232 Participants</div>
        <div> View 24242,222 Files</div>
      </div>
      <div>
        <div>Summary View</div>
        <div>Table View</div>
      </div>
    </ContentSection>
    <CohortResults />
  </Container>
);

export default CohortBuilder;
