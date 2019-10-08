import * as React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';

import { CAVATICA } from 'common/constants';
import CavaticaConnectModal from './CavaticaConnectModal';
import CavaticaCopyModalManager from './CavaticaCopyModalManager';

const showConnectModal = ({ effects, props }) => {
  effects.setModal({
    title: 'How to Connect to Cavatica',
    component: (
      <CavaticaConnectModal
        withWarning={true}
        onComplete={() => showCopyModal({ effects, props })}
        onCancel={effects.unsetModal}
      />
    ),
  });
};

const showCopyModal = ({ effects, fileIds, sqon, props }) => {
  const isPlural = fileIds && fileIds.length > 1;
  effects.setModal({
    title: `Copy File${isPlural ? 's' : ''} to Cavatica Project`,
    component: (
      <CavaticaCopyModalManager
        onComplete={effects.unsetModal}
        onCancel={effects.unsetModal}
        fileIds={fileIds}
        sqon={sqon}
        {...props}
      />
    ),
  });
};

const CavaticaOpenModalWrapper = compose(injectState)(
  ({ state, effects, children, fileIds, ...props }) => {
    const connected = state.integrationTokens[CAVATICA];
    const clickAction = connected ? showCopyModal : showConnectModal;
    const sqon =
      fileIds && fileIds.length > 0
        ? {
            op: 'and',
            content: [
              {
                op: 'in',
                content: { field: '_id', value: fileIds },
              },
            ],
          }
        : props.sqon;
    return (
      <div
        onClick={() => clickAction({ effects, fileIds, sqon, props })}
        style={{ cursor: 'pointer' }}
      >
        {children}
      </div>
    );
  },
);

CavaticaOpenModalWrapper.defaultProps = {
  source: {},
};

export default CavaticaOpenModalWrapper;
