import * as React from 'react';
import { injectState } from 'freactal';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';

import { ModalFooter } from '../Modal/index.js';
import { AdvancedFacetView } from '@arranger/components/dist/Arranger';
import { provideLocalSqon } from 'stateProviders';

const enhance = compose(provideLocalSqon, injectState, withTheme);

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
      theme,
      ...props
    } = this.props;
    return (
      <React.Fragment>
        <div className={`${theme.advancedFacetView}`}>
          <AdvancedFacetView
            {...{
              ...props,
              sqon: localSqon,
              fieldTypesToExclude: ['id', 'text', 'date', 'boolean'],
              onSqonChange: ({ sqon }) => {
                effects.setAdvancedFacetSqon(sqon);
              },
            }}
          />
        </div>
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
