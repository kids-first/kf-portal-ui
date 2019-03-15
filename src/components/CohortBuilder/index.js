import React from 'react';
import styled from 'react-emotion';
import { withApi } from 'services/api';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import urlJoin from 'url-join';
import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import Component from 'react-component-component';

import { H1 } from 'uikit/Headings';
import Row from 'uikit/Row';
import Categories from './Categories';
import ContentBar from './ContentBar';
import Results from './Results';
import SqonBuilder from './SqonBuilder';
import SQONProvider from './SQONProvider';
import VirtualStudyListProvider, { getSavedVirtualStudyNames } from './VirtualStudyListProvider';
import { personaApiRoot, shortUrlApi } from 'common/injectGlobals';
import { ModalFooter, ModalWarning } from 'components/Modal/index.js';

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

const createNewVirtualStudy = async ({ virtualStudy, loggedInUser, api, name }) => {
  const { sqons, activeIndex } = virtualStudy;
  const {
    data: {
      self: { virtualStudies: currentVirtualStudies },
    },
  } = await getSavedVirtualStudyNames(api);
  const egoId = (loggedInUser || {}).egoId;
  const { id } = await api({
    url: urlJoin(shortUrlApi, 'shorten'),
    body: JSON.stringify({
      userid: egoId,
      alias: 'test',
      sharedPublicly: false,
      content: {
        sqons,
        activeIndex,
      },
    }),
  });
  await api({
    url: urlJoin(personaApiRoot, 'graphql', 'PERSONA_UPDATE_VIRTUAL_STUDIES'),
    body: {
      variables: {
        virtualStudies: [...currentVirtualStudies, { id, name }],
        egoId,
      },
      query: print(gql`
        mutation($virtualStudies: [UserModelUserModelVirtualStudiesInput], $egoId: String) {
          userUpdate(
            record: {
              _id: "5c7480da9af7f706f2608d8c"
              egoId: $egoId
              firstName: "MINH"
              virtualStudies: $virtualStudies
            }
          ) {
            record {
              firstName
              email
              virtualStudies {
                name
                id
              }
            }
          }
        }
      `),
    },
  });
};

const promptForStudiesData = ({ effects }) => {
  return new Promise((resolve, reject) => {
    effects.setModal({
      title: 'How to Connect to Cavatica',
      component: (
        <Component initialState={{ name: '' }}>
          {({ state, setState }) => {
            return (
              <React.Fragment>
                <input value={state.name} onChange={e => setState({ name: e.target.value })} />
                <ModalFooter
                  {...{
                    handleSubmit: async () => {
                      resolve({ name: state.name });
                      effects.unsetModal();
                    },
                    submitText: 'Save',
                    // submitDisabled: invalidToken || !isValidKey(cavaticaKey),
                  }}
                />
              </React.Fragment>
            );
          }}
        </Component>
      ),
    });
  });
};

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
          const onSaveClick = () => {
            promptForStudiesData({ effects })
              .then(({ name }) =>
                createNewVirtualStudy({
                  api,
                  loggedInUser,
                  virtualStudy: {
                    sqons: syntheticSqons,
                    activeIndex: activeSqonIndex,
                  },
                  name,
                }),
              )
              .then(refetchVirtualStudies);
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
