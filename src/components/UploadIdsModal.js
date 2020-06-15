import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { MatchBox } from '@kfarranger/components/dist/Arranger';
import graphql from 'services/arranger';
import { ModalFooter } from './Modal';
import { TealActionButton } from 'uikit/Button';
import { Paragraph } from 'uikit/Core';
import { H3, TableHeader } from 'uikit/Headings';
import { withApi } from 'services/api';

const enhance = compose(injectState, withApi);

const UploadIdsModal = ({
  api,
  state: { loggedInUser },
  effects: { addUserSet, unsetModal },
  setSQON,
  uploadableFields = null,
  placeholderText,
  closeModal,
  graphqlField,
  index,
  projectId,
  searchFields,
  whitelist,
}) => (
  <MatchBox
    {...{ closeModal, graphqlField, index, projectId, searchFields, whitelist }}
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
    browseButtonText={'Upload csv'}
    matchHeaderText={
      <H3 style={{ fontSize: '16px' }} mb="0.8em">
        Matching files in the Kids First Data Repository
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

UploadIdsModal.propTypes = {
  api: PropTypes.func.isRequired,
  setSQON: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  whitelist: PropTypes.arrayOf(PropTypes.string).isRequired,
  uploadableFields: PropTypes.arrayOf(PropTypes.string),
  searchFields: PropTypes.string,
  projectId: PropTypes.string,
  index: PropTypes.string,
  graphqlField: PropTypes.string,
  placeholderText: PropTypes.string,
  state: PropTypes.object.isRequired,
  effects: PropTypes.object.isRequired,
};

export default enhance(UploadIdsModal);
