import React from 'react';
import styled from 'react-emotion';
import { withApi } from 'services/api';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { css } from 'emotion';

import { H1 } from 'uikit/Headings';
import Row from 'uikit/Row';
import Categories from './Categories';
import ContentBar from './ContentBar';
import Results from './Results';
import SqonBuilder from './SqonBuilder';
import SQONProvider from './SQONProvider';
import VirtualStudyListProvider from './VirtualStudyListProvider';
import SaveVirtualStudiesModalContent from './SaveVirtualStudiesModalContent';
import { createNewVirtualStudy } from './utils';

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

const CohortBuilder = compose(
  withApi,
  injectState,
)(({ api, state: { loggedInUser }, effects }) => (
  <VirtualStudyListProvider>
    {({ virtualStudies, refetch: refetchVirtualStudies, loading: loadingVirtualStudyList }) => (
      <SQONProvider>
        {({
          sqons: syntheticSqons,
          activeIndex: activeSqonIndex,
          setActiveSqonIndex,
          setSqons,
          getActiveExecutableSqon,
          mergeSqonToActiveIndex,
          selectedVirtualStudy,
          onVirtualStudySelect,
          setVirtualStudy,
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
          const saveStudy = async studyName => {
            const newStudyId = await createNewVirtualStudy({
              api,
              loggedInUser,
              virtualStudy: {
                sqons: syntheticSqons,
                activeIndex: activeSqonIndex,
              },
              name: studyName,
            });
            await refetchVirtualStudies();
            setVirtualStudy(newStudyId);
          };

          const onSaveClick = () => {
            effects.setModal({
              title: 'Save as Virtual Study',
              classNames: {
                modal: css`
                  max-width: 800px;
                `,
              },
              component: (
                <SaveVirtualStudiesModalContent
                  onSubmit={({ studyName }) => saveStudy(studyName)}
                />
              ),
            });
          };

          return (
            <Container>
              <Content>
                <Row>
                  <Heading>Explore Data</Heading>
                  <select value={selectedVirtualStudy} onChange={onVirtualStudySelectChange}>
                    <option value="" disabled selected>
                      Load a Virtual Study
                    </option>
                    {virtualStudies
                      ? virtualStudies.map(({ id, name }) => (
                          <option value={id} key={id}>
                            {name}
                          </option>
                        ))
                      : null}
                  </select>
                </Row>
                <Row>
                  <button disabled={loadingVirtualStudyList} onClick={onSaveClick}>
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
          );
        }}
      </SQONProvider>
    )}
  </VirtualStudyListProvider>
));

export default CohortBuilder;
