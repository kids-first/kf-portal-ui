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
import { TealActionButton } from 'uikit/Button.js';
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
import PromptMessage from 'uikit/PromptMessage';

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

const PaddedShareQuery = styled(ShareQuery)`
  margin-right: 10px;
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
          const onVirtualStudySelectChange = e => {
            onVirtualStudySelect(e.target.value);
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

          const onDeleteClick = (deleteStudyCallback) => {
            effects.setModal({
              title: `Do you really want to delete your virtual study "${selectedVirtualStudy}"?`,
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
                  { selectedVirtualStudy ? <HeadingWithStudy>{selectedVirtualStudy}</HeadingWithStudy> : <HeadingWithoutStudy>Virtual Study</HeadingWithoutStudy> }
                </Row>
                <Row>

                  <select
                    value={selectedVirtualStudy}
                    onChange={onVirtualStudySelectChange}
                    disabled={!virtualStudies.length}
                  >
                    <option value="" selected>
                      Load a Virtual Study
                    </option>
                    {virtualStudies.map(({ id, name }) => (
                      <option value={id} key={id}>
                        {name}
                      </option>
                    ))}
                  </select>

                  <TealActionButton
                    mr={'10px'}
                    disabled={loadingVirtualStudyList}
                    onClick={onSaveClick}
                  >
                    <span>
                      <SaveIcon height={10} width={10} fill={'white'} />
                    </span>
                    <SaveButtonText>Save</SaveButtonText>
                  </TealActionButton>

                  {sharingEnabled ? (
                    <PaddedShareQuery
                      getSharableUrl={getSharableUrl}
                      handleShare={() => Promise.resolve({ id: selectedVirtualStudy })}
                    />
                  ) : (
                    <Tooltip html={<div>Please save this study to enable sharing</div>}>
                      <PaddedShareQuery disabled />
                    </Tooltip>
                  )}

                  {selectedVirtualStudy ? (
                    <DeleteQuery
                      handleDelete={onDeleteClick}
                    />
                  ) : (
                    <Tooltip html={<div>Please save this study to enable deletion</div>}>
                      <DeleteQuery disabled />
                    </Tooltip>
                  )}
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
