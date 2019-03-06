import React from 'react';
import styled from 'react-emotion';
import { compose } from 'recompose';
import { injectState } from 'freactal/lib/inject';
import saveSet from '@arranger/components/dist/utils/saveSet';

import Categories from './Categories';
import ContentBar from './ContentBar';
import Results from './Results';
import { H1 } from 'uikit/Headings';
import Row from 'uikit/Row';
import SqonBuilder from './SqonBuilder';
import SQONProvider from './SQONProvider';
import { withRouter } from 'react-router-dom';
import graphql from 'services/arranger';
import { withApi } from 'services/api';

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

const CohortBuilder = ({ api, state: { loggedInUser } }) => (
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

      const createNewSqonExcludingParticipants = participantIds => {
        saveSet({
          type: 'participant',
          sqon: {
            op: 'in',
            content: {
              field: 'kf_id',
              value: participantIds,
            },
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
                  op: 'not',
                  content: [
                    {
                      op: 'in',
                      content: {
                        field: 'kf_id',
                        value: [`set_id:${data.saveSet.setId}`],
                      },
                    },
                  ],
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
            />
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
);

export default compose(
  injectState,
  withRouter,
  withApi,
)(CohortBuilder);
