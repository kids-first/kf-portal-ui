import * as React from 'react';
import { injectState } from 'freactal';
import { compose } from 'recompose';

import { AdvancedFacetView } from '@arranger/components/dist/Arranger';
import { provideLocalSqon } from 'stateProviders';
const LiveAdvancedFacetView = AdvancedFacetView;

const STYLE = {
  ADVANCED_FACET_OVERLAY: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  ADVANCED_FACET_CONTAINER: {
    width: 1000,
    height: 720,
    position: 'relative',
    background: 'white',
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  ADVANCED_FACET_WRAPPER: {
    padding: 20,
    paddingBottom: 0,
  },
  ADVANCED_FACET_TITLE: {
    marginLeft: 20,
    marginTop: 20,
    borderBottom: 'solid 1px #d4d6dd',
    paddingBottom: 10,
    marginRight: 20,
    fontFamily: 'Montserrat',
    textAlign: 'left',
    color: '#2b388f',
  },
  ADVANCED_FACET_FOOTER: {
    backgroundColor: '#edeef1',
    boxShadow: '0 0 2.9px 0.1px #a0a0a3',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
    padding: 20,
  },
};

const enhance = compose(injectState);

const AdvancedFacetViewModal = ({ closeModal = () => {}, onSqonSubmit = () => {}, ...props }) => (
  <div style={STYLE.ADVANCED_FACET_OVERLAY} onClick={() => closeModal()}>
    <div style={STYLE.ADVANCED_FACET_CONTAINER} onClick={e => e.stopPropagation()}>
      <div style={STYLE.ADVANCED_FACET_TITLE}>All filters</div>
      <div
        style={{
          ...STYLE.ADVANCED_FACET_WRAPPER,
          flex: 1,
          display: 'flex',
        }}
      >
        <div style={{ position: 'relative', flex: 1 }}>
          <LiveAdvancedFacetView {...props} />
        </div>
      </div>
      <div style={STYLE.ADVANCED_FACET_FOOTER}>
        <div className="cancel" onClick={e => closeModal()}>
          Cancel
        </div>
        {/* <div>Fancy Stats</div> */}
        <div>
          <div
            onClick={e => {
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

// export default provideLocalSqon(enhance(AdvancedFacetViewModal));
export default AdvancedFacetViewModal;
