import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal/lib/inject';

import DownloadManifestModal, { DownloadManifestModalFooter } from './DownloadManifestModal';
import { fileManifestParticipantsOnly } from '../services/downloadData';

const enhance = compose(injectState);

const ParticipantManifestModal = ({
  sqon,
  index,
  projectId,
  columns,
  api,
  effects: { unsetModal },
}) => (
  <DownloadManifestModal {...{ sqon, index, projectId, api }}>
    {({ setWarning }) => (
      <DownloadManifestModalFooter
        {...{
          api,
          sqon,
          projectId,
          setWarning,
          onDownloadClick: async () => {
            await fileManifestParticipantsOnly({ sqon, columns })();
            unsetModal();
          },
        }}
      />
    )}
  </DownloadManifestModal>
);

export default enhance(ParticipantManifestModal);
