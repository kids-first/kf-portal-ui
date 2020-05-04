import * as React from 'react';
import { Button, Col, List, Row } from 'antd';
import { Typography } from 'antd';
import { RocketOutlined, LoadingOutlined } from '@ant-design/icons';
import azicon from 'assets/appache-zeppelin.png';
import { launchCluster, getStatus } from './fetchVariantCluster';

import './index.css';

const { Title } = Typography;
const MAX_MINUTES_TRY = 10; //minutes
const INCREMENT = 3000;

type VariantDbProps = {
  api: Function;
  isAdmin: boolean;
  loggedInUserToken: string;
};

type VariantDbState = {
  clusterStared: boolean;
  isFetching: boolean;
};

class VariantDb extends React.Component<VariantDbProps, VariantDbState> {
  state = {
    clusterStared: false,
    isFetching: false,
  };

  data = [
    {
      name: 'Studies',
      value: 13,
    },
    {
      name: 'Participants',
      value: <div>14494</div>,
    },
    {
      name: 'Genes',
      value: 21393,
    },
    {
      name: 'Variants',
      value: 29848393,
    },
    {
      name: 'Exomic variants',
      value: 2387298,
    },
  ];

  getCluster = (api: Function) => {
    let interval: NodeJS.Timeout;
    let counter = 1;

    const verifyStatus = () => {
      if (counter * INCREMENT > MAX_MINUTES_TRY * 60 * 1000) {
        this.setState({
          clusterStared: false,
          isFetching: false,
        });
        clearInterval(interval);
      }

      getStatus(api).then((res) => {
        if (res.status === 'CREATE_COMPLETE') {
          this.setState({
            clusterStared: true,
            isFetching: false,
          });
          console.log(res, counter);
          clearInterval(interval);
        } else {
          console.log(res, counter);
          counter++;
        }
      });
    };

    interval = setInterval(verifyStatus, INCREMENT);
  };

  handleClick = () => {
    const { clusterStared, isFetching } = this.state;
    const { api } = this.props;

    if (!isFetching && !clusterStared) {
      this.setState({
        isFetching: true,
      });
      launchCluster(api).then((res) => {
        // if (res.state === 'CREATE_IN_PROGRESS') this.getCluster(api);
        console.log(res.status, 'STATUS b4');
        this.getCluster(api);
      });
    } else if (clusterStared) {
      console.log('Launching cluster');
      //launch cluster
    } else {
      console.log('Waiting fo cluster the be build');
    }
  };

  render() {
    const { clusterStared, isFetching } = this.state;
    return (
      <div className="background-container" style={{ padding: 32 }}>
        <Row style={{ paddingBottom: 32 }}>
          <Col flex={'auto'} span={16}>
            <Title level={2} style={{ marginBottom: 8 }}>
              Germline Small Variant Database
            </Title>
            <Title level={4} style={{ margin: 0 }}>
              The Kids First germline small variant data warehouse contains harmonized variant calls
              and clinical data on probands and their parents.
            </Title>
          </Col>
          <Col span={8} />
        </Row>
        <Row justify={'center'} gutter={24}>
          <Col span={16}>
            <div
              className={'white-background middle-align'}
              style={{ height: '100%', paddingTop: 24, paddingBottom: 24 }}
            >
              <img alt="AppacheZeppelin" src={azicon} />
              <div style={{ paddingTop: 24, paddingBottom: 24 }}>
                Kids First is providing members with their own SPARK cluster running a web-based
                Zeppelin notrebooks dansbox to explore, query and visualize its germline variant
                datasets. Using Zeppelin, bioinformaticians can create interactive data analytics
                and collaborative documents with SQL, Scala, Python, and more..
              </div>
              <Button
                type={'primary'}
                icon={isFetching ? <LoadingOutlined /> : <RocketOutlined />}
                onClick={this.handleClick}
              >
                Launch your SPARK cluster with Zeppelin
              </Button>
            </div>
          </Col>
          <Col span={8}>
            <div
              className={'white-background'}
              style={{ paddingTop: 16, paddingLeft: 24, paddingRight: 24, paddingBottom: 8 }}
            >
              <List
                header={
                  <Row justify={'space-between'} style={{ padding: 0 }}>
                    <Title level={4}>Data Release 1</Title>
                    <div>May 13, 2020</div>
                  </Row>
                }
                dataSource={this.data}
                renderItem={(item) => (
                  <List.Item>
                    <Row style={{ display: 'contents' }}>
                      <Col>{item.name}:</Col>
                      <Col>{item.value}</Col>
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
