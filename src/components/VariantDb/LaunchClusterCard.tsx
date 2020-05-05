import azicon from '../../assets/appache-zeppelin.png';
import { Button, Col, Modal, Row } from 'antd';
import { DeleteOutlined, LoadingOutlined, RocketOutlined, ToolOutlined } from '@ant-design/icons';
import * as React from 'react';
import { clusterStatus, isInterimState, canBeDeleted } from './store';

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
    <div
      className={'white-background middle-align'}
      style={{ height: '100%', paddingTop: 24, paddingBottom: 24 }}
    >
      <img alt="AppacheZeppelin" src={azicon} />
      <div style={{ paddingTop: 24, paddingBottom: 24 }}>
        Kids First is providing members with their own SPARK cluster running a web-based Zeppelin
        notrebooks dansbox to explore, query and visualize its germline variant datasets. Using
        Zeppelin, bioinformaticians can create interactive data analytics and collaborative
        documents with SQL, Scala, Python, and more..
      </div>
      <Row justify={'center'} gutter={24}>
        <Col>
          <Button
            type={status === clusterStatus.createComplete ? 'primary' : 'default'}
            icon={buttonIcon}
            onClick={handleClick}
            disabled={isInterimState(status)}
          >
            {buttonText}
          </Button>
        </Col>
        <Col>
          {canBeDeleted(status) ? (
            <div>
              <Button type={'primary'} danger icon={<DeleteOutlined />} onClick={showModal}>
                Delete Cluster
              </Button>
              <Modal
                title="Delete Cluster"
                visible={modalVisible}
                onOk={hideModalOk}
                onCancel={hideModal}
                okText="OK"
                cancelText="Cancel"
              >
                <p>You want to delete this cluster?</p>
              </Modal>
            </div>
          ) : (
            ''
          )}
        </Col>
      </Row>
    </div>
  );
};

export default LaunchClusterCard;
