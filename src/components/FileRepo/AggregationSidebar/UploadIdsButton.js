import React from 'react';

import { Trans } from 'react-i18next';
import styled from 'react-emotion';

import UploadIdsModal from 'components/UploadIdsModal';
import { WhiteButton } from 'uikit/Button';
import Row from 'uikit/Row';

const UploadButton = styled(WhiteButton)`
  border-radius: 100px;
  margin: 0px;
`;

const UploadIdsButton = ({ theme, state, effects, searchFields, setSQON, ...props }) => (
  <Row>
    <UploadButton
      onClick={() =>
        effects.setModal({
          title: 'Upload a List of Identifiers',
          component: (
            <UploadIdsModal
              {...{ ...props, setSQON, searchFields }}
              closeModal={effects.unsetModal}
            />
          ),
        })
      }
    >
      <Trans>Upload Ids</Trans>
    </UploadButton>
  </Row>
);

export default UploadIdsButton;
