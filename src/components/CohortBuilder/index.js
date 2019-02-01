import React from 'react';
import styled from 'react-emotion';
import Categories from './Categories';
import ContentSection from './ContentSection';
import ContentBar from './ContentBar';
import Results from './Results';
import { H1 } from 'uikit/Headings';
import Dropdown from 'uikit/Dropdown';
import Row from 'uikit/Row';
import Queries from './Queries';

const Container = styled('div')`
  flex: 1;
  flex-direction: column;
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  background-color: #f4f5f8;
`;

const Heading = styled(H1)`
  color: #2b388f;
`;

const Left = styled(Row)`
  h1 {
    margin-right: 20px;
  }
`;

const Right = styled(Row)``;

const FullWidthWhite = styled('div')`
  width: 100%;
  background: white;
  padding: 0 30px 30px 30px;
`;

const CohortBuilder = () => (
  <Container>
    <ContentBar>
      <Left>
        <Heading>Explore Data</Heading>
        <div>Load a Virtual Study</div>
      </Left>
      <Right>
        <button>Save virtual study</button>
        <button>Share</button>
      </Right>
    </ContentBar>
    <FullWidthWhite>
      <Categories />
      <Queries />
    </FullWidthWhite>

    <Results />
  </Container>
);

export default CohortBuilder;
