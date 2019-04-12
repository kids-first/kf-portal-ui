import React from 'react';
import styled from 'react-emotion';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { css } from 'emotion';
import { withRouter } from 'react-router-dom';
import urlJoin from 'url-join';

import saveSet from '@arranger/components/dist/utils/saveSet';
import graphql from 'services/arranger';
import { withApi } from 'services/api';
import { createNewVirtualStudy, deleteVirtualStudy } from 'services/virtualStudies';
import { H1 } from 'uikit/Headings';

import Tooltip from 'uikit/Tooltip';
import { TealActionButton, WhiteButton } from 'uikit/Button.js';
import Row from 'uikit/Row';
import Categories from './Categories';
import ContentBar from './ContentBar';
import Results from './Results';
import SqonBuilder from './SqonBuilder';
import SQONProvider from './SQONProvider';
import VirtualStudyListProvider from './VirtualStudyListProvider';
import SaveVirtualStudiesModalContent from './SaveVirtualStudiesModalContent';
import DeleteVirtualStudiesModalContent from './DeleteVirtualStudiesModalContent';
import SaveIcon from 'icons/SaveIcon';
import ShareQuery from 'components/LoadShareSaveDeleteQuery/ShareQuery';
import DeleteQuery from 'components/LoadShareSaveDeleteQuery/DeleteQuery';
import LoadQuery from 'components/LoadShareSaveDeleteQuery/LoadQuery';
import PromptMessage from 'uikit/PromptMessage';
import OpenMenuIcon from 'react-icons/lib/fa/folder';

const Container = styled('div')`
  width: 100%;
  background-color: ${({ theme }) => theme.backgroundGrey};
`;

const HeadingWithStudy = styled(H1)`
  color: #2b388f;
`;

const HeadingWithoutStudy = styled(H1)`
  color: #CCCCCC;
`;

const FullWidthWhite = styled('div')`
  width: 100%;
  background: white;
  margin-top: 21px;
`;

const SqonBuilderContainer = styled('div')`
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 30px;
  padding-right: 30px;
  border-top: solid 1px rgb(212, 214, 221);
  box-shadow: 0 3px 5px -3px ${({ theme }) => theme.lighterShadow};
`;

const Content = styled(ContentBar)`
  padding-left: 30px;
  padding-right: 30px;
`;

const StylePromptMessage = styled(PromptMessage)`
  width: 100%;
`;

const SaveButtonText = styled('span')`
  margin-left: 5px;
`;

const CohortBuilder = compose(
  withApi,
  injectState,
  withRouter,
)(({ api, state: { loggedInUser }, effects, history }) => (
  <VirtualStudyListProvider>
    {({
      virtualStudies = [],
      refetch: refetchVirtualStudies,
      loading: loadingVirtualStudyList,
    }) => (
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
          isOwner,
        }) => {
          const executableSqon = getActiveExecutableSqon();
          const sqonBuilderSqonsChange = ({ newSyntheticSqons }) => {
            setSqons(newSyntheticSqons);
          };
          const sqonBuilderActiveSqonSelect = (props) => {
            setActiveSqonIndex(props.index);
          };
          const categoriesSqonUpdate = newSqon => {
            mergeSqonToActiveIndex(newSqon);
          };
          const saveStudy = async studyName => {
            if (!(studyName || '').length) {
              throw new Error('Study name cannot be empty');
            }
            const { id: newStudyId } = await createNewVirtualStudy({
              api,
              loggedInUser,
              sqonsState: {
                sqons: syntheticSqons,
                activeIndex: activeSqonIndex,
              },
              name: studyName,
              description: '',
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

          const deleteStudy = async (deleteStudyCallback) => {
            if (!(selectedVirtualStudy || '').length) {
              throw new Error('Study name cannot be empty');
            }
            await deleteVirtualStudy({
              loggedInUser,
              api,
              name: selectedVirtualStudy,
            });
            await deleteStudyCallback(selectedVirtualStudy);
            await refetchVirtualStudies();
            setVirtualStudy('');
          };

          const findSelectedStudy = () => {
            return virtualStudies.filter((study) => {
              return study.id === selectedVirtualStudy;
            }).shift();
          };

          const onDeleteClick = (deleteStudyCallback) => {
            const study = findSelectedStudy();
            effects.setModal({
              title: `Do you really want to delete your virtual study "${study.name}"?`,
              classNames: {
                modal: css`
                  max-width: 800px;
                `,
              },
              component: (
                <DeleteVirtualStudiesModalContent
                  onSubmit={() => deleteStudy(deleteStudyCallback)}
                />
              ),
            });
          };

          const createNewSqonExcludingParticipants = participantIds => {
            saveSet({
              type: 'participant',
              sqon: {
                op: 'and',
                content: [
                  {
                    op: 'in',
                    content: {
                      field: 'kf_id',
                      value: participantIds,
                    },
                  },
                ],
              },
              userId: loggedInUser.egoId,
              path: 'kf_id',
              api: graphql(api),
            })
              .then(({ data }) => {
                const newSqon = {
                  op: 'and',
                  content: [
                    activeSqonIndex,
                    {
                      op: 'not-in',
                      content: {
                        field: 'kf_id',
                        value: [`set_id:${data.saveSet.setId}`],
                      },
                    },
                  ],
                };
                const newSqons = [...syntheticSqons, newSqon];
                setSqons(newSqons);
                return newSqons.length - 1;
              })
              .then(newSqonIndex => {
                setActiveSqonIndex(newSqonIndex);
              })
              .catch(console.error);
          };
          const sharingEnabled = !!selectedVirtualStudy;
          const getSharableUrl = ({ id }) =>
            urlJoin(
              window.location.origin,
              history.createHref({ ...history.location, search: `id=${id}` }),
            );
          const selectedStudy = findSelectedStudy();

          return (
            <Container>
              <StylePromptMessage
                content={
                  <div>
                    <strong>BETA RELEASE: </strong>Use the cohort builder to create virtual studies.
                    You can query participant variables including demographic, clinical, and data
                    categories. It's in progress, so you may experience some bugs. To give feedback,
                    click the button in the bottom right corner. All feedback is welcome!
                  </div>
                }
              />
              <Content>
                <Row>
                  { selectedStudy ? <HeadingWithStudy>{selectedStudy.name}</HeadingWithStudy> : <HeadingWithoutStudy>Virtual Study</HeadingWithoutStudy> }
                </Row>
                <Row>

                  <WhiteButton
                    disabled={loadingVirtualStudyList}
                    onClick={() => { onVirtualStudySelect('') }}
                  >
                    <span>
                      <OpenMenuIcon height={11} width={11} />
                    </span>
                    <SaveButtonText>New</SaveButtonText>
                  </WhiteButton>

                  <span style={{marginLeft: 10, marginRight: 10}}>
                    <LoadQuery
                      studies={virtualStudies}
                      selection={selectedStudy}
                      handleOpen={onVirtualStudySelect}
                      disabled={loadingVirtualStudyList}
                    />
                  </span>

                  <TealActionButton
                    disabled={loadingVirtualStudyList}
                    onClick={onSaveClick}
                    mr={10}
                  >
                    <span>
                      <SaveIcon height={10} width={10} fill={'white'} />
                    </span>
                    <SaveButtonText>{ selectedVirtualStudy ? 'Clone' : 'Save' }</SaveButtonText>
                  </TealActionButton>

                  {sharingEnabled ? (
                    <ShareQuery
                      getSharableUrl={getSharableUrl}
                      handleShare={() => Promise.resolve({ id: selectedVirtualStudy })}
                    />
                  ) : (
                    <Tooltip html={<div>Please save this study to enable sharing</div>}>
                      <ShareQuery disabled />
                    </Tooltip>
                  )}
                  <span style={{marginLeft: 10}}>
                  {selectedVirtualStudy ? (
                      <DeleteQuery
                      handleDelete={onDeleteClick}
                    />
                  ) : (
                    <Tooltip html={<div>Please save this study to enable deletion</div>}>
                      <DeleteQuery disabled />
                    </Tooltip>
                  )}
                  </span>
                </Row>
              </Content>
              <FullWidthWhite>
                <Content>
                  <Categories sqon={executableSqon} onSqonUpdate={categoriesSqonUpdate} />
                </Content>
                <SqonBuilderContainer>
                  <SqonBuilder
                    syntheticSqons={syntheticSqons}
                    activeSqonIndex={activeSqonIndex}
                    onChange={sqonBuilderSqonsChange}
                    onActiveSqonSelect={sqonBuilderActiveSqonSelect}
                    emptyEntryMessage="Use the filters above to build a query"
                  />
                </SqonBuilderContainer>
              </FullWidthWhite>
              <Results
                sqon={executableSqon}
                activeSqonIndex={activeSqonIndex}
                onRemoveFromCohort={createNewSqonExcludingParticipants}
              />
            </Container>
          );
        }}
      </SQONProvider>
    )}
  </VirtualStudyListProvider>
));
export default CohortBuilder;
