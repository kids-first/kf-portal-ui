import React from 'react';
import styled from 'react-emotion';
import Categories from './Categories';
import ContentBar from './ContentBar';
import Results from './Results';
import { H1 } from 'uikit/Headings';
import Row from 'uikit/Row';
import Queries from './Queries';
import SQONProvider from './SQONProvider';
import { withRouter } from 'react-router-dom';

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
  margin-right: 20px;
`;

const FullWidthWhite = styled('div')`
  width: 100%;
  background: white;
  padding: 0 30px 30px 30px;
`;

const CohortBuilder = () => (
  <SQONProvider>
    {({
      sqons: syntheticSqons,
      activeIndex: activeSqonIndex,
      setActiveSqonIndex,
      setSqons,
      getActiveExecutableSqon,
    }) => (
      <Container>
        <ContentBar>
          <Row>
            <Heading>Explore Data</Heading>
            <div>Load a Virtual Study</div>
          </Row>
          <Row>
            <button>Save virtual study</button>
            <button>Share</button>
          </Row>
        </ContentBar>
        <FullWidthWhite>
          <Categories />
          <Queries
            syntheticSqons={syntheticSqons}
            activeSqonIndex={activeSqonIndex}
            onChange={({ newSyntheticSqons }) => {
              setSqons(newSyntheticSqons);
            }}
            onActiveSqonSelect={({ index }) => {
              setActiveSqonIndex(index);
            }}
          />
        </FullWidthWhite>
        <Results sqon={getActiveExecutableSqon()} />
      </Container>
    )}
  </SQONProvider>
);

export default withRouter(CohortBuilder);
