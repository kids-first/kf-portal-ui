import * as React from 'react';
import { Button, Col, List, Row } from 'antd';
import { Typography } from 'antd';
import { RocketOutlined } from '@ant-design/icons';
import azicon from 'assets/appache-zeppelin.png';

import './index.css';

const { Title } = Typography;

class VariantDb extends React.Component {
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

  render() {
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
              <Button type={'primary'} icon={<RocketOutlined />}>
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
