import React from 'react';
import { compose, withState } from 'recompose';

import IconWithLoading from 'icons/IconWithLoading';
import DownloadIcon from 'icons/DownloadIcon';
import Row from 'uikit/Row';
import { TealActionButton } from 'uikit/Button';
import { ModalFooter, ModalWarning } from './Modal';
import LoadingOnClick from 'components/LoadingOnClick';

export const DownloadManifestModalFooter = ({
  downloadLoading,
  onDownloadClick,
}) => (
  <ModalFooter showSubmit={false}>
    <Row style={{ flex: '1', height: '100%' }} center>
    </Row>
    <LoadingOnClick
      onClick={onDownloadClick}
      render={({ onClick, loading, finalLoading = loading || downloadLoading }) => (
        <TealActionButton onClick={onClick} disabled={finalLoading} style={{ height: '100%' }}>
          <IconWithLoading
            loading={finalLoading}
            Icon={() => <DownloadIcon style={{ marginRight: '9px' }} />}
          />
          Download Manifest
        </TealActionButton>
      )}
    />
  </ModalFooter>
);

export default compose(withState('warning', 'setWarning', ''))(
  ({ sqon, index, projectId, warning, setWarning, children, api }) => (
    <div>
      {warning && <ModalWarning>{warning}</ModalWarning>}
      {children({ setWarning })}
    </div>
  ),
);
