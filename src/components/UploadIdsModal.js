import React from 'react';
import { compose } from 'recompose';
import { Trans } from 'react-i18next';
import { withTheme } from 'emotion-theming';
import { css } from 'react-emotion';
import { injectState } from 'freactal';

import { MatchBox } from '@arranger/components/dist/Arranger';
import { ModalFooter } from './Modal';
import graphql from '../services/arranger';

const UploadButton = withTheme(({ theme, ...props }) => (
  <button className={theme.actionButton} {...props} />
));

const enhance = compose(withTheme, injectState);

const UploadIdsModal = ({ theme, state: { loggedInUser }, setSQON, closeModal, ...props }) => (
  <div>
    <MatchBox
      {...{ ...props, setSQON }}
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
      {({ hasResults, saveSet }) => (
        <ModalFooter
          {...{
            handleSubmit: async () => {
              await saveSet({ userId: loggedInUser.egoId, api: graphql });
              closeModal();
            },
            submitText: 'Upload',
            submitDisabled: !hasResults,
          }}
        />
      )}
    </MatchBox>
  </div>
);

export default enhance(UploadIdsModal);
