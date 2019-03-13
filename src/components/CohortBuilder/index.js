import React from 'react';
import styled from 'react-emotion';

import { H1 } from 'uikit/Headings';
import Row from 'uikit/Row';
import Categories from './Categories';
import ContentBar from './ContentBar';
import Results from './Results';
import SqonBuilder from './SqonBuilder';
import SQONProvider from './SQONProvider';
import VirtualStudyListProvider from './VirtualStudyListProvider';

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
      virtualStudies,
      selectedVirtualStudy,
      onVirtualStudySelect,
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
      const onVirtualStudySelectChange = e => {
        onVirtualStudySelect(e.target.value);
      };
      const onSaveClick = refetchVirtualStudies => () => {
        refetchVirtualStudies();
      };
      return (
        <VirtualStudyListProvider>
          {({
            virtualStudies,
            refetch: refetchVirtualStudies,
            loading: loadingVirtualStudyList,
          }) => (
            <Container>
              <Content>
                <Row>
                  <Heading>Explore Data</Heading>
                  <select value={selectedVirtualStudy} onChange={onVirtualStudySelectChange}>
                    <option value="" disabled selected>
                      Load a Virtual Study
                    </option>
                    {virtualStudies.map(({ id, name }) => (
                      <option value={id} key={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </Row>
                <Row>
                  <button
                    disabled={loadingVirtualStudyList}
                    onClick={onSaveClick(refetchVirtualStudies)}
                  >
                    {!loadingVirtualStudyList ? 'Save virtual study' : '...LOADING'}
                  </button>
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
          )}
        </VirtualStudyListProvider>
      );
    }}
  </SQONProvider>
);

export default CohortBuilder;
