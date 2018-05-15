import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal/lib/inject';

import DownloadManifestModal, { DownloadManifestModalFooter } from './DownloadManifestModal';
import { fileManifestParticipantsOnly } from '../services/downloadData';
import { trackUserInteraction, TRACKING_EVENTS } from '../services/analyticsTracking';

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
            await fileManifestParticipantsOnly({ sqon, columns })()
              .then(data => {
                  trackUserInteraction({
                    category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
                    action: 'Download Manifest',
                    label: 'Participant Manifest',
                  });
              })
              .catch(err => {
                trackUserInteraction({
                    category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
                    action: 'Download Manifest FAILED',
                    label: err,
                  });
              });

            unsetModal();
          },
        }}
      />
    )}
  </DownloadManifestModal>
);

export default enhance(ParticipantManifestModal);
