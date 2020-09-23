import azicon from '../../assets/appache-zeppelin.png';
import { Button, Modal } from 'antd';
import { DeleteOutlined, LoadingOutlined, RocketOutlined, ToolOutlined } from '@ant-design/icons';
import * as React from 'react';
import { clusterStatus, isInterimState, canBeDeleted } from './store';
import './index.css';

interface Props {
  status: string;
  modalVisible: boolean;
  hideModalOk: (e: React.MouseEvent<HTMLElement>) => void;
  hideModal: (e: React.MouseEvent<HTMLElement>) => void;
  showModal: (e: React.MouseEvent<HTMLElement>) => void;
  handleClick: (e: React.MouseEvent<HTMLElement>) => void;
}

const LaunchClusterCard = (props: Props) => {
  const { status, modalVisible, hideModalOk, hideModal, showModal, handleClick } = props;

  let buttonText;
  let buttonIcon;
  switch (status) {
    case clusterStatus.createComplete:
      buttonText = 'Launch your SPARK cluster';
      buttonIcon = <RocketOutlined />;
      break;
    case clusterStatus.createInProgress:
      buttonText = 'Building your SPARK cluster';
      buttonIcon = <LoadingOutlined />;
      break;
    case clusterStatus.deleteInProgress:
      buttonText = 'Deleting your SPARK cluster';
      buttonIcon = <LoadingOutlined />;
      break;
    case clusterStatus.rollback:
      buttonText = 'Error, please delete the cluster';
      buttonIcon = <LoadingOutlined />;
      break;
    default:
      buttonText = 'Build a SPARK cluster';
      buttonIcon = <ToolOutlined />;
  }
  return (
    <div className={'white-background middle-align launch-cluster-container'}>
      <Modal
        title="Shut Down Cluster"
        visible={modalVisible}
        onOk={hideModalOk}
        onCancel={hideModal}
        okText="OK"
        cancelText="Cancel"
      >
        <p>Do you want to shut down this cluster?</p>
      </Modal>
      <div className={'logo-btns-container'}>
        <img alt="Appache-Zeppelin-Logo" src={azicon} />
        <div className={'btns-container'}>
          <Button
            className={'create-cluster-btn'}
            id="createClusterButton"
            type={status === clusterStatus.createComplete ? 'primary' : 'default'}
            icon={buttonIcon}
            onClick={handleClick}
            disabled={isInterimState(status)}
          >
            {buttonText}
          </Button>
          {canBeDeleted(status) && (
            <div>
              <Button
                id={'deleteClusterButton'}
                type={'primary'}
                danger
                icon={<DeleteOutlined />}
                onClick={showModal}
              >
                Shut Down Cluster
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className={'main-text-container'}>
        The Variant Workbench is a cloud-based analysis platform for querying and analyzing Kids
        First data.
        <br />
        <br />
        The Variant Workbench is powered by web-based Zeppelin Notebooks. Using Zeppelin,
        bioinformaticians can create interactive data analytics and collaborative documents with
        SQL, Scala, Python, and more.
        <br />
        <br />
        The Workbench contains germline variant calls and clinical data for probands and families registered
        in Kids First studies. The same variants found in the harmonized gVCF files provided by the
        Kids First DRC have been loaded into tables that can be explored using several programming
        languages.
        <br />
        <br />
        Additionally, the Workbench is loaded with predicted consequences for these variants on
        genes. Clinical information and family relationships have also been uploaded, with all of
        these fields paired by Kids First Participant ID.
        <br />
        <br />
        By combining clinical and genomic data together in one tool, the Variant Workbench allows
        users to query across these data types in one cloud-based environment, accelerating research
        in the field of pediatric cancer and structural birth defects.
      </div>
    </div>
  );
};

export default LaunchClusterCard;
