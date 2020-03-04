import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';

import Categories from './Categories';
import ContentBar from './ContentBar';
import Results from './Results';
import SqonBuilder from './SqonBuilder';
import SQONProvider from './SQONProvider';
import VirtualStudiesMenu from './VirtualStudiesMenu';
import ParticipantIcon from 'icons/ParticipantIcon';

import './CohortBuilder.css';

const CohortBuilder = compose(injectState)(({ state: { loggedInUser } }) => (
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

      return (
        <div className="cb-container">
          <VirtualStudiesMenu />

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

          <Results sqon={executableSqon} activeSqonIndex={activeSqonIndex} />
        </div>
      );
    }}
  </SQONProvider>
));
export default CohortBuilder;
