import React from 'react';
import styled from 'react-emotion';
import Categories from './Categories';
import ContentSection from './ContentSection';
import ContentBar from './ContentBar';
import Results from './Results';

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

    <Results />
  </Container>
);

export default CohortBuilder;
