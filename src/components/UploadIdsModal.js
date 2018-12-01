import React from 'react';
import { compose } from 'recompose';
import { Trans } from 'react-i18next';
import { withTheme } from 'emotion-theming';
import { injectState } from 'freactal';

import { MatchBox } from '@arranger/components/dist/Arranger';
import graphql from 'services/arranger';
import { ModalFooter } from './Modal';
import { TealActionButton } from 'uikit/Button';
import { Paragraph } from 'uikit/Core';
import { FileRepoH3 as H3 } from 'uikit/Headings';
import { TableHeader } from 'uikit/Table';
import { withApi } from 'services/api';

const enhance = compose(withTheme, injectState, withApi);

const UploadIdsModal = ({
  api,
  theme,
  state: { loggedInUser },
  effects: { addUserSet, unsetModal },
  setSQON,
  uploadableFields = null,
  placeholderText,
  ...props
}) => (
  <MatchBox
    {...props}
    instructionText={
      <Paragraph>Type or copy-and-paste a list of comma delimited identifiers</Paragraph>
    }
    placeholderText={placeholderText}
    entitySelectText={<Paragraph>Select the entity to upload</Paragraph>}
    entitySelectPlaceholder={'Select an Entity'}
    matchedTabTitle={'Matched'}
    unmatchedTabTitle={'Unmatched'}
    matchTableColumnHeaders={{
      inputId: <TableHeader>Input Id</TableHeader>,
      matchedEntity: <TableHeader>Matched Entity</TableHeader>,
      entityId: <TableHeader>Entity Id</TableHeader>,
    }}
    uploadableFields={uploadableFields}
    uploadInstructionText={<Paragraph>Or choose file to upload</Paragraph>}
    browseButtonText={<Trans>Upload csv</Trans>}
    matchHeaderText={
      <H3 mb="0.8em">
        <Trans>Matching files in the Kids First Data Repository</Trans>
      </H3>
    }
    ButtonComponent={TealActionButton}
  >
    {({ hasResults, saveSet }) => (
      <ModalFooter
        {...{
          handleSubmit: async () => {
            const { type, setId, size, nextSQON } = await saveSet({
              userId: loggedInUser.egoId,
              api: graphql(),
            });
            await addUserSet({ type, setId, size, api });
            setSQON(nextSQON);
            unsetModal();
          },
          submitText: 'View Results',
          submitDisabled: !hasResults,
        }}
      />
    )}
  </MatchBox>
);

export default enhance(UploadIdsModal);
