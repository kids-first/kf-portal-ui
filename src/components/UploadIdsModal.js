import React from 'react';
import { MatchBox } from '@kfarranger/components/dist/Arranger';
import { Button, Modal, notification, Typography } from 'antd';
import PropTypes from 'prop-types';

import graphql from 'services/arranger';
import { TableHeader } from 'uikit/Headings';

import useUser from '../hooks/useUser';

import LoadingOnClick from './LoadingOnClick';

import './uploadIdsModal.css';

const { Title, Paragraph } = Typography;

const UploadIdsModal = (props) => {
  const {
    setSQON,
    uploadableFields,
    placeholderText,
    closeModal,
    graphqlField,
    index,
    projectId,
    searchFields,
    whitelist,
    isVisible,
  } = props;

  const { user } = useUser();

  return (
    <Modal
      width={'65%'}
      visible={isVisible}
      title="Upload a List of Identifiers"
      footer={null}
      onCancel={closeModal}
      destroyOnClose
    >
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
          <Title level={3} style={{ marginBottom: '0.8em' }}>
            Matching files in the Kids First Data Repository
          </Title>
        }
        ButtonComponent={Button}
      >
        {({ hasResults, saveSet }) => (
          <div className={'wrapper-modal-footer'}>
            <Button key="cancel" onClick={closeModal}>
              Cancel
            </Button>
            <LoadingOnClick
              onClick={async () => {
                try {
                  const { nextSQON } = await saveSet({
                    userId: user.egoId,
                    api: graphql(),
                  });
                  setSQON(nextSQON);
                } catch (e) {
                  notification.error({
                    message: 'Unable to upload ids',
                    description: 'An error occurred while uploading your ids',
                    duration: 10,
                  });
                } finally {
                  closeModal();
                }
              }}
              render={({ onClick, loading }) => (
                <Button
                  className={'view-results-btn'}
                  disabled={!hasResults}
                  loading={loading}
                  key="ok"
                  type="primary"
                  onClick={onClick}
                >
                  View Results
                </Button>
              )}
            />
          </div>
        )}
      </MatchBox>
    </Modal>
  );
};

UploadIdsModal.defaultProps = { uploadableFields: null };

UploadIdsModal.propTypes = {
  setSQON: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  whitelist: PropTypes.arrayOf(PropTypes.string).isRequired,
  uploadableFields: PropTypes.arrayOf(PropTypes.string),
  searchFields: PropTypes.string,
  projectId: PropTypes.string,
  index: PropTypes.string,
  graphqlField: PropTypes.string,
  placeholderText: PropTypes.string,
  isVisible: PropTypes.bool.isRequired,
};

export default UploadIdsModal;
