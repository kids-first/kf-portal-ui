import * as React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';

import { CAVATICA } from 'common/constants';
import CavaticaConnectModal from './CavaticaConnectModal';
import CavaticaCopyModal from './CavaticaCopyModal';

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
  effects.setModal({
    title: 'Copy Files to Cavatica Project',
    component: (
      <CavaticaCopyModal
        onComplete={effects.unsetModal}
        onCancel={effects.unsetModal}
        fileIds={fileIds}
        sqon={sqon}
        {...props}
      />
    ),
  });
};

export default compose(injectState)(({ state, effects, children, fileIds, ...props }) => {
  const connected = state.integrationTokens[CAVATICA];
  const clickAction = connected ? showCopyModal : showConnectModal;
  const sqon =
    fileIds && fileIds.length > 0
      ? {
          op: 'and',
          content: [
            {
              op: 'in',
              content: { field: 'kf_id', value: fileIds },
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
});
