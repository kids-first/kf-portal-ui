import * as React from 'react';
import styled from 'react-emotion';
import { injectState } from 'freactal';
import { compose } from 'recompose';

import { ModalFooter } from '../Modal/index.js';
import { AdvancedFacetView } from '@arranger/components/dist/Arranger';
import { provideLocalSqon } from 'stateProviders';
import { FilterInput } from 'uikit/Input';
import { TRACKING_EVENTS } from '../../services/analyticsTracking';

const enhance = compose(
  provideLocalSqon,
  injectState,
);

const AfvContainer = styled('div')`
  flex: 1;
  display: flex;
  position: relative;

  .advancedFacetViewWrapper {
    padding: 0px;
  }
  .advancedFacetViewWrapper .facetViewWrapper .treeViewPanel {
    border-bottom: none;
  }

  .afvStatContainer .statContainer {
    background: none;
    padding: none;
    border: none;
  }

  .afvStatContainer .statContainer .stat {
    padding-left: 10px;
    padding-right: 10px;
  }
`;

const CustomFilterInput = styled(FilterInput)`
  width: auto;
`;

class AdvancedFacetViewModalContent extends React.Component {
  onOverlayClick = e => {
    const { closeModal = () => {} } = this.props;
    if (e.target === this.overLay) {
      closeModal();
    }
  };

  render() {
    const {
      effects,
      state: { localSqon },
      closeModal = () => {},
      onSqonSubmit = () => {},
      trackFileRepoInteraction,
      ...props
    } = this.props;
    return (
      <React.Fragment>
        <AfvContainer>
          <AdvancedFacetView
            {...props}
            InputComponent={CustomFilterInput}
            sqon={localSqon}
            onSqonChange={({ sqon, field, value }) => effects.setAdvancedFacetSqon(sqon)}
            onSqonSubmit={({ sqon }) => {
              trackFileRepoInteraction({
                category: TRACKING_EVENTS.categories.fileRepo.filters + ' - Advanced',
                action: 'View Results',
                label: sqon,
              });
            }}
            onFilterChange={val => {
              trackFileRepoInteraction({
                category: TRACKING_EVENTS.categories.fileRepo.filters + ' - Advanced',
                action: TRACKING_EVENTS.actions.filter + ' - Search',
                ...(val && { label: val }),
              });
            }}
            onTermSelected={({ field, value, active }) => {
              if (active) {
                trackFileRepoInteraction({
                  category: TRACKING_EVENTS.categories.fileRepo.filters + ' - Advanced',
                  action: TRACKING_EVENTS.actions.filter + ' Selected',
                  label: {
                    type: 'filter',
                    value,
                    field,
                  },
                });
              }
            }}
            onClear={() => {
              trackFileRepoInteraction({
                category: TRACKING_EVENTS.categories.fileRepo.filters + ' - Advanced',
                action: TRACKING_EVENTS.actions.query.clear,
              });
            }}
          />
        </AfvContainer>
        <ModalFooter
          {...{
            unsetModal: closeModal,
            handleSubmit: e => onSqonSubmit({ sqon: localSqon }),
            submitText: 'View Results',
          }}
        />
      </React.Fragment>
    );
  }
}

export default enhance(AdvancedFacetViewModalContent);
