import React from 'react';

import UploadIdsModal from 'components/UploadIdsModal';
import { ActionButton } from 'uikit/Button';
import UploadIcon from 'icons/UploadIcon';

const UploadIdsButton = ({
  theme,
  state,
  effects,
  searchFields,
  matchboxPlaceholderText,
  modalTitle = 'Upload a List of Identifiers',
  setSQON,
  ...props
}) => (
  <ActionButton
    style={{
      borderRadius: '100px',
      margin: '0px',
    }}
    onClick={() =>
      effects.setModal({
        title: modalTitle,
        component: (
          <UploadIdsModal
            placeholderText={matchboxPlaceholderText}
            {...{ ...props, setSQON, searchFields }}
            closeModal={effects.unsetModal}
          />
        ),
      })
    }
  >
    <UploadIcon width="13px" height="16px" style={{ marginRight: '5px' }} />
    {'UPLOAD YOUR LIST OF IDS'}
  </ActionButton>
);

export default UploadIdsButton;
