import { Button, Card, Col, Row, Space } from 'antd';

import style from './index.module.scss';
import GeneBanner from '../VariantBanner/GeneBanner';

const VariantSummary = () => {
  return (
    <Card className={style.card}>
      {/* <div></div>
      <div></div>
      <div></div> */}

      <Space className={style.space} direction="vertical" size={'middle'}>
        <Row justify="space-between" wrap>
          <Col span={4}>col-4test1</Col>
          <Col span={4}>col-4test2</Col>
          <Col span={4}>col-4test3</Col>
          <Col span={4}>col-4test4</Col>
          <Col span={4}>col-4test5</Col>
        </Row>

        <div className={style.bannerWrapper}>
          <Row justify="space-between" wrap>
            <Col xs={2} sm={2} md={4} lg={4} xl={4} xxl={4}>
              <div>title</div>
              <div>value value value</div>
            </Col>
            <Col xs={2} sm={2} md={4} lg={4} xl={4} xxl={4}>
              <div>title</div>
              <div>value value value</div>
            </Col>
            <Col xs={2} sm={2} md={4} lg={4} xl={4} xxl={4}>
              <div>title</div>
              <div>value value value</div>
            </Col>
            <Col xs={2} sm={2} md={4} lg={4} xl={4} xxl={4}>
              <div>title</div>
              <div>value value value</div>
            </Col>
            <Col xs={2} sm={2} md={4} lg={4} xl={4} xxl={4}>
              <div>title</div>
              <div>value value value</div>
            </Col>
          </Row>
        </div>

        <div className={style.bannerWrapper}>
          <Row justify="space-between" wrap>
            <Col span={4}>
              <div>title</div>
              <div>value value value</div>
            </Col>
            <Col span={4}>
              <div>title</div>
              <div>value value value</div>
            </Col>
            <Col span={4}>
              <div>title</div>
              <div>value value value</div>
            </Col>
            <Col span={4}>
              <div>title</div>
              <div>value value value</div>
            </Col>
            <Col span={4}>
              <div>title</div>
              <div>value value value</div>
            </Col>
          </Row>
        </div>

        <div className={style.spaceAlignContainer}>
          <div className={style.spaceAlignBlock}>
            <Space direction="vertical">
              <span>title</span>
              <span>value value value</span>
            </Space>
          </div>
          <div className={style.spaceAlignBlock}>
            <Space direction="vertical">
              <span>title</span>
              <span>value value value</span>
            </Space>
          </div>
          <div className={style.spaceAlignBlock}>
            <Space direction="vertical">
              <span>title</span>
              <span>value value value</span>
            </Space>
          </div>
          <div className={style.spaceAlignBlock}>
            <Space direction="vertical">
              <span>title</span>
              <span>value value value</span>
            </Space>
          </div>
          <div className={style.spaceAlignBlock}>
            <Space direction="vertical">
              <span>title</span>
              <span>value value value</span>
            </Space>
          </div>
        </div>
      </Space>
    </Card>
  );
};

export default VariantSummary;
