import React from 'react';
import styled from 'react-emotion';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';

import saveSet from '@kfarranger/components/dist/utils/saveSet';
import graphql from 'services/arranger';
import { withApi } from 'services/api';

import Categories from './Categories';
import ContentBar from './ContentBar';
import Results from './Results';
import SqonBuilder from './SqonBuilder';
import SQONProvider from './SQONProvider';
import VirtualStudiesMenu from './VirtualStudiesMenu';
import ParticipantIcon from 'icons/ParticipantIcon';
import PromptMessage from 'uikit/PromptMessage';

const Container = styled('div')`
  width: 100%;
  background-color: ${({ theme }) => theme.backgroundGrey};
`;

const FullWidthWhite = styled('div')`
  width: 100%;
  background: white;
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
  margin-top: 0;
`;

const StylePromptMessage = styled(PromptMessage)`
  width: 100%;
`;

const CohortBuilder = compose(
  withApi,
  withTheme,
  injectState,
)(({ api, state: { loggedInUser }, theme }) => (
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
      const sqonBuilderActiveSqonSelect = props => {
        setActiveSqonIndex(props.index);
      };
      const categoriesSqonUpdate = newSqon => {
        mergeSqonToActiveIndex(newSqon);
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

      return (
        <Container>
          <StylePromptMessage
            content={
              <div>
                <strong>BETA RELEASE: </strong>Use the cohort builder to create virtual studies. You
                can query participant variables including demographic, clinical, and data
                categories. It's in progress, so you may experience some bugs. To give feedback,
                click the button in the bottom right corner. All feedback is welcome!
              </div>
            }
          />

          <VirtualStudiesMenu />

          <FullWidthWhite>
            <Content>
              <Categories sqon={executableSqon} onSqonUpdate={categoriesSqonUpdate} />
            </Content>
            <SqonBuilderContainer css={`
            .sqonView {
              margin-right: 60px;
            }
            `}>
              <SqonBuilder
                syntheticSqons={syntheticSqons}
                activeSqonIndex={activeSqonIndex}
                onChange={sqonBuilderSqonsChange}
                onActiveSqonSelect={sqonBuilderActiveSqonSelect}
                emptyEntryMessage="Use the filters above to build a query"
                ResultCountIcon={ParticipantIcon}
                resultCountIconProps={{
                  height: 18,
                  width: 18,
                  fill: theme.greyScale11,
                }}
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
));
export default CohortBuilder;
