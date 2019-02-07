import React from 'react';
import styled from 'react-emotion';
import Categories from './Categories';
import ContentBar from './ContentBar';
import Results from './Results';
import { H1 } from 'uikit/Headings';
import Row from 'uikit/Row';
import { isReference } from '@arranger/components/dist/AdvancedSqonBuilder/utils';
import SqonBuilder from './Queries';
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
  margin-top: 21px;
`;

const mergeSqonIntoIndex = ({ syntheticSqons, newSqon, index }) =>
  syntheticSqons.map((currentSqon, i) =>
    i === index
      ? {
          ...currentSqon,
          content: newSqon.content.map((newContent, _i) =>
            isReference(currentSqon.content[_i]) ? currentSqon.content[_i] : newContent,
          ),
        }
      : currentSqon,
  );

const CohortBuilder = () => (
  <SQONProvider>
    {({
      sqons: syntheticSqons,
      activeIndex: activeSqonIndex,
      setActiveSqonIndex,
      setSqons,
      getActiveExecutableSqon,
    }) => {
      const executableSqon = getActiveExecutableSqon();
      const sqonBuilderSqonsChange = ({ newSyntheticSqons }) => {
        setSqons(newSyntheticSqons);
      };
      const sqonBuilderActiveSqonSelect = ({ index }) => {
        setActiveSqonIndex(index);
      };
      const categoriesSqonUpdate = newSqon => {
        setSqons(
          mergeSqonIntoIndex({
            syntheticSqons,
            newSqon,
            index: activeSqonIndex,
          }),
        );
      };
      return (
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
            <Categories sqon={executableSqon} onSqonUpdate={categoriesSqonUpdate} />
            <SqonBuilder
              syntheticSqons={syntheticSqons}
              activeSqonIndex={activeSqonIndex}
              onChange={sqonBuilderSqonsChange}
              onActiveSqonSelect={sqonBuilderActiveSqonSelect}
            />
          </FullWidthWhite>
          <Results sqon={executableSqon} />
        </Container>
      );
    }}
  </SQONProvider>
);

export default withRouter(CohortBuilder);
