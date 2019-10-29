import React from 'react';
import styled from 'react-emotion';
import { css } from 'emotion';

import UploadIdsModal from 'components/UploadIdsModal';
import { ActionButton } from 'uikit/Button';
import UploadIcon from 'icons/UploadIcon';

const UploadButton = styled(ActionButton)`
  border-radius: 100px;
  margin: 0px;
`;

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
  <UploadButton
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
    <UploadIcon
      className={css`
        margin-right: 5px;
      `}
    />
    {'UPLOAD YOUR LIST OF IDS'}
  </UploadButton>
);

export default UploadIdsButton;
