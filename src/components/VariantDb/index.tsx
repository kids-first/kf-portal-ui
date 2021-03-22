import * as React from 'react';
import { Button, Col, List, notification, Row, Typography } from 'antd';
import { deleteCluster, getStatus, launchCluster } from './fetchVariantCluster';
import { MAX_MINUTES_TRY, INCREMENT, clusterStatus, isInterimState } from './store';

import './index.css';
import LaunchClusterCard from './LaunchClusterCard';

const { Title } = Typography;

type VariantDbProps = {
  api: Function;
};

type VariantDbState = {
  status: string;
  modalVisible: boolean;
};

const data = [
  {
    name: 'Studies',
    value: 6,
  },
  {
    name: 'Participants',
    value: <div>5,053</div>,
  },
  {
    name: 'Distinct Variants',
    value: '200,569,156',
  },
  {
    name: 'Occurrences',
    value: '21,295,117,739',
  },
];

class VariantDb extends React.Component<VariantDbProps, VariantDbState> {
  state = {
    status: '',
    modalVisible: false,
  };

  errorNotification = (message: string, decription: string) => {
    notification.error({
      message: message,
      description: decription,
    });
  };

  async componentDidMount() {
    const { api } = this.props;
    try {
      const res = await getStatus(api);
      if (isInterimState(res.status)) {
        this.resolveInterimState(api);
      } else if (res.status === clusterStatus.rollback) {
        await deleteCluster(api);
        this.resolveInterimState(api);
      }

      this.setState({
        status: res.status,
      });
    } catch (e) {
      this.errorNotification(`Error ${e.response?.status || ''}`, 'Cannot connect with cluster');
    }
  }

  resolveInterimState = (api: Function) => {
    let interval: NodeJS.Timeout;
    let counter = 1;

    const verifyStatus = async () => {
      if (counter * INCREMENT > MAX_MINUTES_TRY * 60 * 1000) {
        this.setState({
          status: clusterStatus.stopped,
        });
        clearInterval(interval); // throw timeout exception
      }

      try {
        const res = await getStatus(api);

        if (!isInterimState(res.status)) {
          this.setState({
            status: res.status,
          });
          clearInterval(interval);
        } else {
          counter++;
        }
      } catch (e) {
        this.errorNotification(`Error ${e.response?.status || ''}`, 'Cannot connect with cluster');
      }
    };
    interval = setInterval(verifyStatus, INCREMENT);
  };

  handleClick = async () => {
    const { status } = this.state;
    const { api } = this.props;
    if (status === '') {
      try {
        const res = await getStatus(api);
        this.setState({
          status: res.status,
        });
      } catch (e) {
        this.errorNotification(`Error ${e.response?.status || ''}`, 'Cannot connect with cluster');
      }
    }

    if (status === clusterStatus.stopped) {
      try {
        this.setState({
          status: clusterStatus.createInProgress,
        });
        await launchCluster(api);
        this.openNotification();
        this.resolveInterimState(api);
      } catch (e) {
        this.setState({
          status: clusterStatus.stopped,
        });
        this.errorNotification(`Error ${e.response?.status || ''}`, 'Cannot launch cluster');
      }
    } else if (status === clusterStatus.createComplete) {
      const res = await getStatus(api);
      window.open(res.url, '_blank');
    }
  };

  openNotification = () => {
    const key = `open${Date.now()}`;
    const btn = (
      <Button type="primary" size="small" onClick={() => notification.close(key)}>
        OK
      </Button>
    );
    notification.open({
      message: 'Building the cluster, please wait',
      description:
        'The Spark cluster is being build. This can take up to 10 min to complete. ' +
        'You can continue using the portal and come back to this page once this operation ' +
        'has completed',
      duration: 15,
      btn,
      key,
    });
  };

  showModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  hideModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  hideModalOk = async () => {
    const { api } = this.props;
    this.setState({
      status: clusterStatus.deleteInProgress,
    });
    try {
      await deleteCluster(api);
    } catch (e) {
      this.errorNotification(`Error ${e.response?.status || ''}`, 'Error deleting the cluster');
    }

    this.setState({
      modalVisible: false,
    });

    this.resolveInterimState(api);
  };

  render() {
    const { status, modalVisible } = this.state;
    return (
      <div className="variant-db-container">
        <Row className={'main-title-row'}>
          <Col flex={'auto'} span={16}>
            <Title level={2} style={{ marginBottom: 8, color: '#2B388F' }}>
              Kids First Variant Workbench
            </Title>
          </Col>
          <Col span={8} />
        </Row>
        <Row justify={'center'} gutter={24}>
          <Col span={16}>
            <LaunchClusterCard
              status={status}
              modalVisible={modalVisible}
              hideModalOk={this.hideModalOk}
              hideModal={this.hideModal}
              showModal={this.showModal}
              handleClick={this.handleClick}
            />
          </Col>
          <Col span={8}>
            <div className={'white-background stats-container'}>
              <List
                header={
                  <Row justify={'space-between'} className={'data-header-row'}>
                    <Title
                      level={4}
                      style={{
                        fontFamily: 'Open Sans',
                        fontWeight: 600,
                        fontSize: 16,
                        lineHeight: '24px',
                      }}
                    >
                      Data Release 1
                    </Title>
                    <div
                      style={{
                        fontFamily: 'Open Sans',
                        fontWeight: 600,
                        fontSize: 14,
                        lineHeight: '22px',
                        color: '#7D84A6',
                      }}
                    >
                      January 21 , 2021
                    </div>
                  </Row>
                }
                dataSource={data}
                renderItem={(item) => (
                  <List.Item>
                    <Row className={'data-item-row'}>
                      <Col
                        style={{
                          fontFamily: 'Open Sans',
                          color: '#515885',
                        }}
                      >
                        {item.name}
                      </Col>
                      <Col
                        style={{
                          fontFamily: 'Open Sans',
                          color: '#515885',
                        }}
                      >
                        {item.value}
                      </Col>
                    </Row>
                  </List.Item>
                )}
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default VariantDb;
