import * as React from 'react';
import { injectState } from 'freactal';
import { compose } from 'recompose';

import { ModalFooter } from '../Modal/index.js';
import { AdvancedFacetView } from '@arranger/components/dist/Arranger';
import { provideLocalSqon } from 'stateProviders';
import './style.css';

const enhance = compose(provideLocalSqon, injectState);

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
      ...props
    } = this.props;
    return (
      <React.Fragment>
        <div className="advancedFacetsWrapper">
          <div style={{ position: 'relative', flex: 1 }}>
            <AdvancedFacetView
              {...{
                ...props,
                sqon: localSqon,
                onSqonChange: ({ sqon }) => {
                  effects.setAdvancedFacetSqon(sqon);
                },
              }}
            />
          </div>
        </div>
        <ModalFooter
          {...{
            unsetModal: closeModal,
            handleSubmit: onSqonSubmit,
            submitText: 'View Results',
          }}
        />
      </React.Fragment>
    );
  }
}

export default enhance(AdvancedFacetViewModalContent);
