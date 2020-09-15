import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import Categories from './Categories';
import ContentBar from './ContentBar';
import Results from './Results';
import SqonBuilder from './SqonBuilder';
import SQONProvider from './SQONProvider';
import VirtualStudiesMenu from './VirtualStudiesMenu';
import ParticipantIcon from 'icons/ParticipantIcon';
import ConfirmDelVirtualStudy from 'components/Modal/ConfirmDelVirtualStudy.tsx';

import { Modals, arrangerActions } from './Modals';

import './CohortBuilder.css';

const CohortBuilder = () => {
  const [showDelVSModal, setShowDelVSModal] = useState(false);
  const [virtualStudyToDelete, setVirtualStudyToDelete] = useState(null);
  const dispatch = useDispatch();

  return (
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
        const sqonBuilderActiveSqonSelect = (props) => {
          // eslint-disable-next-line react/prop-types
          setActiveSqonIndex(props.index);
        };
        const categoriesSqonUpdate = (newSqon) => {
          mergeSqonToActiveIndex(newSqon);
        };

        return (
          <>
            {showDelVSModal && (
              <ConfirmDelVirtualStudy
                virtualStudy={virtualStudyToDelete}
                onCloseCb={() => setShowDelVSModal(false)}
              />
            )}
            <div className="cb-container">
              <VirtualStudiesMenu
                setVirtualStudyToDeleteCB={setVirtualStudyToDelete}
                setShowDelVSModalCB={setShowDelVSModal}
              />
              <Modals initialSqon={executableSqon} />

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
                  actionsProvider={arrangerActions(dispatch)}
                />
              </div>

              <Results sqon={executableSqon} activeSqonIndex={activeSqonIndex} />
            </div>
          </>
        );
      }}
    </SQONProvider>
  );
};

export default CohortBuilder;
