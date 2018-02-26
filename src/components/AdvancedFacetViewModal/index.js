import * as React from 'react';
import { injectState } from 'freactal';
import { compose } from 'recompose';

import { AdvancedFacetView } from '@arranger/components/dist/Arranger';
import { provideLocalSqon } from 'stateProviders';
import './style.css';

const enhance = compose(provideLocalSqon, injectState);

class AdvancedFacetViewModal extends React.Component {
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
      <div
        className="advancedFacetsOverlay"
        ref={el => (this.overLay = el)}
        onClick={this.onOverlayClick}
      >
        <div className="advacnedFacetsContainer">
          <div className="advancedFacetsTitle">All filters</div>
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
          <div className="advancedFacetsFooter">
            <div className="cancel" className="cancel" onClick={e => closeModal()}>
              Cancel
            </div>
            <div>
              <div
                className="submitButton"
                onClick={e => {
                  onSqonSubmit({ sqon: localSqon });
                  closeModal();
                }}
                className="submitButton"
              >
                View Results
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default enhance(AdvancedFacetViewModal);
// export default AdvancedFacetViewModal;
