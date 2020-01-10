import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';

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

import './CohortBuilder.css';

const CohortBuilder = compose(
  withApi,
  injectState,
)(({ api, state: { loggedInUser } }) => (
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
        <div className="cb-container">
          <VirtualStudiesMenu />

          {/* <div className="cb-fullWidth"> */}
          <ContentBar className="cb-categories-container">
            <Categories sqon={executableSqon} onSqonUpdate={categoriesSqonUpdate} />
          </ContentBar>
          <div className="cb-sqonBuilder-container">
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
                fill: '#a9adc0',
              }}
            />
          </div>
          {/* </div> */}

          <Results
            sqon={executableSqon}
            activeSqonIndex={activeSqonIndex}
            onRemoveFromCohort={createNewSqonExcludingParticipants}
          />
        </div>
      );
    }}
  </SQONProvider>
));
export default CohortBuilder;
