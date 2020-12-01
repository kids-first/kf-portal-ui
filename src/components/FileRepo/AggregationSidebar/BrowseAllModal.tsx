import React, { useState, useEffect, FunctionComponent } from 'react';
import AdvancedFacetViewModalContent from 'components/AdvancedFacetViewModal';
import { config as statsConfig } from 'components/Stats';
import { TRACKING_EVENTS } from 'services/analyticsTracking';
import { Button, Modal } from 'antd';
import { Sqon } from 'store/sqon';

type OwnProps = {
  setSQON: (s: Sqon | null) => void;
  translateSQONValue: (params: {
    sets: any[];
    defaultSetText: string;
  }) => (value: string) => string;
  trackFileRepoInteraction: (info: any) => void;
  sqon: Sqon;
  fetchData: (body: any) => Promise<any>;
  graphqlField: string;
  index: string;
  projectId: string;
  closeModal: (modalId: string) => void;
  modalName: string;
};

const makeInitialModalSqon = (sqon: Sqon) => (sqon ? { ...sqon } : null);

const BrowseAllModal: FunctionComponent<OwnProps> = ({
  setSQON,
  translateSQONValue,
  trackFileRepoInteraction,
  sqon,
  fetchData,
  graphqlField,
  index,
  projectId,
  closeModal,
  modalName,
}) => {
  const [modalSqon, setModalSqon] = useState<Sqon | null>(makeInitialModalSqon(sqon));

  useEffect(() => {
    setModalSqon(sqon);
  }, [sqon]);

  const onCancel = () => {
    closeModal(modalName);
    setModalSqon(sqon);
  };

  const onSqonSubmit = () => {
    trackFileRepoInteraction({
      category: `${TRACKING_EVENTS.categories.fileRepo.filters} - Advanced`,
      action: 'View Results',
      label: modalSqon,
    });
    setSQON(modalSqon);
    closeModal(modalName);
  };

  return (
    <Modal
      title={'All Filters'}
      width={'85%'}
      onCancel={onCancel}
      visible
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="view-results" type="primary" onClick={onSqonSubmit}>
          View Results
        </Button>,
      ]}
    >
      <AdvancedFacetViewModalContent
        fetchData={fetchData}
        graphqlField={graphqlField}
        index={index}
        projectId={projectId}
        translateSQONValue={translateSQONValue}
        trackFileRepoInteraction={trackFileRepoInteraction}
        onSqonChange={({ sqon }) => {
          setModalSqon(sqon);
        }}
        modalSqon={modalSqon}
        {...{ statsConfig }}
      />
    </Modal>
  );
};

export default BrowseAllModal;
