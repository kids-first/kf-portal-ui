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
import { WhiteButton } from 'uikit/Button.js';
import Row from 'uikit/Row';
import Categories from './Categories';
import ContentBar from './ContentBar';
import Results from './Results';
import SqonBuilder from './SqonBuilder';
import SQONProvider from './SQONProvider';
import VirtualStudyListProvider from './VirtualStudyListProvider';
import SaveVirtualStudiesModalContent from './SaveVirtualStudiesModalContent';
import DeleteVirtualStudiesModalContent from './DeleteVirtualStudiesModalContent';
import ShareQuery from 'components/LoadShareSaveDeleteQuery/ShareQuery';
import DeleteQuery from 'components/LoadShareSaveDeleteQuery/DeleteQuery';
import LoadQuery from 'components/LoadShareSaveDeleteQuery/LoadQuery';
import PromptMessage from 'uikit/PromptMessage';
import OpenMenuIcon from 'react-icons/lib/fa/folder';
import SaveIcon from 'react-icons/lib/fa/file';

const Container = styled('div')`
  width: 100%;
  background-color: ${({ theme }) => theme.backgroundGrey};
`;

const HeadingWithStudy = styled(H1)`
  color: #2b388f;
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

let AlignedSaveIcon = styled(SaveIcon)`
  margin-top: -2px;
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
      loading: virtualStudyListIsLoading,
    }) => (
      <SQONProvider>
        {({
          sqons: syntheticSqons,
          activeIndex: activeSqonIndex,
          setActiveSqonIndex,
          setSqons,
          getActiveExecutableSqon,
          mergeSqonToActiveIndex,
          activeVirtualStudyId,
          setActiveVirtualStudyId,
          isOwner,
        }) => {
          const executableSqon = getActiveExecutableSqon();
          const sqonBuilderSqonsChange = ({ newSyntheticSqons }) => {
            setSqons(newSyntheticSqons);
          };
          const sqonBuilderActiveSqonSelect = props => {
            setActiveSqonIndex(props.index);
          };
          const categoriesSqonUpdate = newSqon => {
            mergeSqonToActiveIndex(newSqon);
          };
          const resetSqons = () => {
            setSqons([{ op: 'and', content: [] }]);
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
            setActiveVirtualStudyId(newStudyId);
          };

          const onSaveAsClick = () => {
            effects.setModal({
              title: 'Save as Virtual Study',
              classNames: {
                modal: css`
                  max-width: 800px;
                `,
              },
              component: <SaveVirtualStudiesModalContent onSubmit={saveStudy} />,
            });
          };

          const deleteStudy = async deleteStudyCallback => {
            if (!(activeVirtualStudyId || '').length) {
              throw new Error('Study name cannot be empty');
            }
            await deleteVirtualStudy({
              loggedInUser,
              api,
              name: activeVirtualStudyId,
            });
            await deleteStudyCallback(activeVirtualStudyId);
            await refetchVirtualStudies();
            // TODO : reset the sqon as soon as possible,
            //  but not in case of a failure
            resetSqons();
            setActiveVirtualStudyId('');
          };

          const findSelectedStudy = () => {
            return virtualStudies.filter(study => study.id === activeVirtualStudyId).shift();
          };

          const onDeleteClick = deleteStudyCallback => {
            const study = findSelectedStudy();
            // Study not found, the study might have been deleted in parallel,
            //  either because the studies has finished reloading and that study isn't there anymore,
            //  or a user is bashing on the delete button. (I'm looking at you, Vincent ;) )
            // Don't even call the callback, as this is a no-op.
            if (!study) return;

            effects.setModal({
              title: `Delete Virtual Study`,
              classNames: {
                modal: css`
                  max-width: 800px;
                `,
              },
              component: (
                <DeleteVirtualStudiesModalContent
                  name={study.name}
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
          const sharingEnabled = !!activeVirtualStudyId;
          const getSharableUrl = ({ id }) =>
            urlJoin(
              window.location.origin,
              history.createHref({ ...history.location, search: `id=${id}` }),
            );
          const selectedStudy = findSelectedStudy();
          // TODO fix potential bug with JSON serialized in a non-deterministic way
          //  do a deep compare with an object instead
          const syntheticSqonIsEmpty =
            JSON.stringify(syntheticSqons) === '[{"op":"and","content":[]}]';
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
                  <HeadingWithStudy>
                    {selectedStudy ? `Virtual Study: ${selectedStudy.name}` : 'Explore Data'}
                  </HeadingWithStudy>
                </Row>
                <Row>
                  <Tooltip html={<div>Create a new virtual study</div>}>
                    <WhiteButton
                      disabled={virtualStudyListIsLoading || !selectedStudy || !selectedStudy.id}
                      onClick={() => {
                        // TODO : reset the sqon as soon as possible,
                        //  but not in case of a failure
                        resetSqons();
                        setActiveVirtualStudyId('');
                      }}
                    >
                      <span>
                        <OpenMenuIcon height={11} width={11} />
                      </span>
                      <SaveButtonText>New</SaveButtonText>
                    </WhiteButton>
                  </Tooltip>

                  <span style={{ marginLeft: 10, marginRight: 10 }}>
                    <Tooltip html={<div>Open a saved virtual study</div>}>
                      <LoadQuery
                        studies={virtualStudies}
                        selection={selectedStudy}
                        handleOpen={setActiveVirtualStudyId}
                        disabled={
                          virtualStudyListIsLoading ||
                          (virtualStudies.length === 1 && selectedStudy && selectedStudy.id) ||
                          virtualStudies.length < 1
                        }
                      />
                    </Tooltip>
                  </span>

                  <span style={{ marginRight: 10 }}>
                    <Tooltip
                      html={
                        <div>
                          {activeVirtualStudyId
                            ? 'Save as a new virtual study'
                            : 'Save a virtual study'}
                        </div>
                      }
                    >
                      <WhiteButton
                        disabled={virtualStudyListIsLoading || syntheticSqonIsEmpty}
                        onClick={onSaveAsClick}
                      >
                        <span>
                          <AlignedSaveIcon height={10} width={10} />
                        </span>
                        <SaveButtonText>{activeVirtualStudyId ? 'Save As' : 'Save'}</SaveButtonText>
                      </WhiteButton>
                    </Tooltip>
                  </span>

                  <span style={{ marginRight: 10 }}>
                    <Tooltip html={<div>Delete this virtual study</div>}>
                      <DeleteQuery disabled={!activeVirtualStudyId} handleDelete={onDeleteClick} />
                    </Tooltip>
                  </span>

                  <Tooltip html={<div>Share this virtual study</div>}>
                    <ShareQuery
                      disabled={!sharingEnabled}
                      getSharableUrl={getSharableUrl}
                      handleShare={() => Promise.resolve({ id: activeVirtualStudyId })}
                    />
                  </Tooltip>
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
