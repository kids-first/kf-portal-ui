import React from 'react';
import styled from 'react-emotion';
import Column from 'uikit/Column';
import Categories from './Categories';
import ContentSection from './ContentSection';
import ContentBar from './ContentBar';
import Summary from './Summary';

const Container = styled('div')`
  flex: 1;
  flex-direction: column;
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  background-color: #f4f5f8;
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
      <ContentBar>
        <div>
          <h2>Cohort Results</h2>
          <div>23232 Participants</div>
          <div> View 24242,222 Files</div>
        </div>
        <div>
          <div>Summary View</div>
          <div>Table View</div>
        </div>
      </ContentBar>
      <Summary />
    </ContentSection>
  </Container>
);

export default CohortBuilder;
