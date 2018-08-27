import * as React from 'react';
import styled from 'react-emotion';
import { injectState } from 'freactal';
import { compose } from 'recompose';

import { ModalFooter } from '../Modal/index.js';
import { AdvancedFacetView } from '@arranger/components/dist/Arranger';
import { provideLocalSqon } from 'stateProviders';
import { FilterInput } from 'uikit/Input';
import { TRACKING_EVENTS } from '../../services/analyticsTracking';

const enhance = compose(provideLocalSqon, injectState);

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
      setSQON,
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
            onFacetNavigation={path => {
              let facetNavEvent = {
                category: TRACKING_EVENTS.categories.fileRepo.filters + ' - Advanced',
                action: TRACKING_EVENTS.actions.click + ' side navigation',
                label: path,
              };
              trackFileRepoInteraction(facetNavEvent);
              if (props.onFacetNavigation) {
                props.onFacetNavigation(path);
              }
            }}
            onFilterChange={val => {
              if (val !== '') {
                trackFileRepoInteraction({
                  category: TRACKING_EVENTS.categories.fileRepo.filters + ' - Advanced',
                  action: TRACKING_EVENTS.actions.filter + ' - Search',
                  ...(val && { label: val }),
                });
                if (props.onFilterChange) {
                  props.onFilterChange(val);
                }
              }
            }}
            onTermSelected={({ field, value, active, ...rest }) => {
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
              if (props.onTermSelected) {
                props.onTermSelected({ field, value, active, ...rest });
              }
            }}
            onClear={() => {
              trackFileRepoInteraction({
                category: TRACKING_EVENTS.categories.fileRepo.filters + ' - Advanced',
                action: TRACKING_EVENTS.actions.query.clear,
              });
              if (props.onClear) {
                props.onClear();
              }
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
