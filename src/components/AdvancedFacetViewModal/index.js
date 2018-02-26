import * as React from 'react';
import { injectState } from 'freactal';
import { compose } from 'recompose';

import { AdvancedFacetView } from '@arranger/components/dist/Arranger';
import { provideLocalSqon } from 'stateProviders';
import './style.css';

const LiveAdvancedFacetView = AdvancedFacetView;

const enhance = compose(provideLocalSqon, injectState);

const AdvancedFacetViewModal = ({
  effects,
  state: { localSqon },
  closeModal = () => {},
  onSqonSubmit = () => {},
  ...props
}) => (
  <div className="advancedFacetsOverlay" onClick={() => closeModal()}>
    <div className="advacnedFacetsContainer" onClick={e => e.stopPropagation()}>
      <div className="advancedFacetsTitle">All filters</div>
      <div className="advancedFacetsWrapper">
        <div style={{ position: 'relative', flex: 1 }}>
          <LiveAdvancedFacetView
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

export default enhance(AdvancedFacetViewModal);
// export default AdvancedFacetViewModal;
