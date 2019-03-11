import React from 'react';
import styled from 'react-emotion';
import Categories from './Categories';
import ContentBar from './ContentBar';
import Results from './Results';
import { H1 } from 'uikit/Headings';
import Row from 'uikit/Row';
import SqonBuilder from './SqonBuilder';
import SQONProvider from './SQONProvider';
import { withRouter } from 'react-router-dom';

const Container = styled('div')`
  width: 100%;
  background-color: ${({ theme }) => theme.backgroundGrey};
`;

const Heading = styled(H1)`
  color: #2b388f;
  margin-right: 20px;
`;

const FullWidthWhite = styled('div')`
  width: 100%;
  background: white;
  padding: 0 30px 30px 30px;
  margin-top: 21px;
`;

const Content = styled(ContentBar)`
  padding: 0 20px 0 32px;
`;

const CohortBuilder = () => (
  <SQONProvider>
    {({
      sqons: syntheticSqons,
      activeIndex: activeSqonIndex,
      setActiveSqonIndex,
      setSqons,
      getActiveExecutableSqon,
      mergeSqonToActiveIndex,
    }) => {
      const executableSqon = getActiveExecutableSqon();
      const sqonBuilderSqonsChange = ({ newSyntheticSqons }) => {
        setSqons(newSyntheticSqons);
      };
      const sqonBuilderActiveSqonSelect = ({ index }) => {
        setActiveSqonIndex(index);
      };
      const categoriesSqonUpdate = newSqon => {
        mergeSqonToActiveIndex(newSqon);
      };
      return (
        <Container>
          <Content>
            <Row>
              <Heading>Explore Data</Heading>
              <div>Load a Virtual Study</div>
            </Row>
            <Row>
              <button>Save virtual study</button>
              <button>Share</button>
            </Row>
          </Content>
          <FullWidthWhite>
            <Categories sqon={executableSqon} onSqonUpdate={categoriesSqonUpdate} />
            <SqonBuilder
              syntheticSqons={syntheticSqons}
              activeSqonIndex={activeSqonIndex}
              onChange={sqonBuilderSqonsChange}
              onActiveSqonSelect={sqonBuilderActiveSqonSelect}
              emptyEntryMessage="Use the filters above to build a query"
            />
          </FullWidthWhite>
          <Results sqon={executableSqon} activeSqonIndex={activeSqonIndex} />
        </Container>
      );
    }}
  </SQONProvider>
);

export default withRouter(CohortBuilder);
