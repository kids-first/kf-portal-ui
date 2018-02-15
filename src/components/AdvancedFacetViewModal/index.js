import * as React from 'react';
import { injectState } from 'freactal';
import { compose } from 'recompose';

import { AdvancedFacetView } from '@arranger/components/dist/Arranger';
import { provideLocalSqon } from 'stateProviders';
const LiveAdvancedFacetView = AdvancedFacetView;

const style = {
  advancedFacetsOverlay: {
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
  advacnedFacetsContainer: {
    width: 1000,
    height: 720,
    position: 'relative',
    background: 'white',
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  advancedFacetsWrapper: {
    flex: 1,
    display: 'flex',
    padding: 20,
    paddingBottom: 0,
  },
  advancedFacetsTitle: {
    marginLeft: 20,
    marginTop: 20,
    borderBottom: 'solid 1px #d4d6dd',
    paddingBottom: 10,
    marginRight: 20,
    fontFamily: 'Montserrat',
    textAlign: 'left',
    color: '#2b388f',
  },
  advancedFacetsFooter: {
    backgroundColor: '#edeef1',
    boxShadow: '0 0 2.9px 0.1px #a0a0a3',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
    padding: 20,
  },
};

const enhance = compose(provideLocalSqon, injectState);

const AdvancedFacetViewModal = ({
  effects,
  state: { localSqon },
  closeModal = () => {},
  onSqonSubmit = () => {},
  ...props
}) => (
  <div style={style.advancedFacetsOverlay} onClick={() => closeModal()}>
    <div style={style.advacnedFacetsContainer} onClick={e => e.stopPropagation()}>
      <div style={style.advancedFacetsTitle}>All filters</div>
      <div style={style.advancedFacetsWrapper}>
        <div style={{ position: 'relative', flex: 1 }}>
          <LiveAdvancedFacetView
            {...{
              ...props,
              sqon: localSqon || props.sqon,
              onSqonChange: ({ sqon }) => {
                effects.setAdvancedFacetSqon(sqon);
              },
            }}
          />
        </div>
      </div>
      <div style={style.advancedFacetsFooter}>
        <div className="cancel" onClick={e => closeModal()}>
          Cancel
        </div>
        <div>
          <div
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
