import React from 'react';
import { Trans } from 'react-i18next';
import { withTheme } from 'emotion-theming';
import { css } from 'react-emotion';

import { MatchBox } from '@arranger/components/dist/Arranger';
import { ModalFooter } from './Modal';

const UploadButton = withTheme(({ theme, ...props }) => (
  <button className={theme.actionButton} {...props} />
));

const UploadIdsModal = withTheme(({ theme, ...props }) => (
  <div>
    <MatchBox
      {...props}
      instructionText={
        <Trans>
          Type or copy-and-paste a list of comma delimited identifiers, or choose a file of
          identifiers to upload
        </Trans>
      }
      placeholderText={`e.g. File Id\ne.g. Case Id\ne.g. Sample Id`}
      matchHeaderText={
        <span
          className={css`
            ${theme.modalTitle};
          `}
        >
          <Trans>Matching Files in the Kids First Data Repository</Trans>
        </span>
      }
      ButtonComponent={UploadButton}
    >
      {({ ids }) => (
        <ModalFooter
          {...{
            handleSubmit: () => console.log(ids),
            submitText: 'Upload',
            submitDisabled: !ids.length,
          }}
        />
      )}
    </MatchBox>
  </div>
));

export default UploadIdsModal;
