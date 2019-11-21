import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col, Divider, Row, Typography } from 'antd';
import FindMeReadOnly from './FindMeReadOnly';
import { extractFindMeFromProfile } from './utils';

const { Text, Title } = Typography;

const ContactReadOnly = props => {
  const { data, canEdit, onClickEditCb } = props;
  return (
    <Card
      title={
        <Title
          level={3}
          style={{
            color: 'rgb(43, 56, 143)',
          }}
        >
          Contact Information
        </Title>
      }
      style={{
        width: '1200px',
        borderRadius: '10px',
      }}
      headStyle={{
        color: 'rgb(43, 56, 143)',
        backgroundColor: 'rgb(237,238,241)',
        paddingBottom: '14px',
        paddingTop: '14px',
        paddingLeft: '32px',
        paddingRight: '32px',
      }}
      bodyStyle={{
        padding: '32px',
      }}
      extra={
        canEdit ? (
          <Button
            style={{ color: 'white', backgroundColor: '#90278e' }}
            icon="edit"
            shape="round"
            onClick={onClickEditCb}
          >
            Edit
          </Button>
        ) : null
      }
    >
      <Row>
        <Col span={14} style={{ paddingRight: '72px' }}>
          <Row type={'flex'} justify="space-between" align="bottom">
            <Col span={4}>
              <Text>{'Email'}</Text>
            </Col>
            <Col span={8}>
              <Text style={Boolean(data.email) ? null : { fontStyle: 'italic' }}>
                {data.email || 'Edit Card to Add Details'}
              </Text>
            </Col>
          </Row>
          <Divider style={{ margin: '18px 0' }} />
          <Row type={'flex'} justify="space-between" align="bottom">
            <Col span={4}>
              <Text>{'Address'}</Text>
              {/* TODO : merge addresses */}
            </Col>
            <Col span={8}>
              <Text style={Boolean(data.addressLine1) ? null : { fontStyle: 'italic' }}>
                {data.addressLine1 || 'Edit Card to Add Details'}
              </Text>
            </Col>
          </Row>
          <Divider style={{ margin: '18px 0' }} />
          <Row type={'flex'} justify="space-between" align="bottom">
            <Col span={4}>
              <Text>{'Institution'}</Text>
            </Col>
            <Col span={8}>
              <Text style={Boolean(data.institution) ? null : { fontStyle: 'italic' }}>
                {data.institution || 'Edit Card to Add Details'}
              </Text>
            </Col>
          </Row>
          <Divider style={{ margin: '18px 0' }} />
          <Row type={'flex'} justify="space-between" align="bottom">
            <Col span={4}>
              <Text>{'City'}</Text>
            </Col>
            <Col span={8}>
              <Text style={Boolean(data.city) ? null : { fontStyle: 'italic' }}>
                {data.city || 'Edit Card to Add Details'}
              </Text>
            </Col>
          </Row>
          <Divider style={{ margin: '18px 0' }} />
          <Row type={'flex'} justify="space-between" align="bottom">
            <Col span={4}>
              <Text>{'Country'}</Text>
            </Col>
            <Col span={8}>
              <Text style={Boolean(data.country) ? null : { fontStyle: 'italic' }}>
                {data.country || 'Edit Card to Add Details'}
              </Text>
            </Col>
          </Row>
          <Divider style={{ margin: '18px 0' }} />
          <Row type={'flex'} justify="space-between" align="bottom">
            <Col span={4}>
              <Text>{'State'}</Text>
            </Col>
            <Col span={8}>
              <Text style={Boolean(data.state) ? null : { fontStyle: 'italic' }}>
                {data.state || 'Edit Card to Add Details'}
              </Text>
            </Col>
          </Row>
          <Divider style={{ margin: '18px 0' }} />
          <Row type={'flex'} justify="space-between" align="bottom">
            <Col span={4}>
              <Text>{'Phone'}</Text>
            </Col>
            <Col span={8}>
              <Text style={Boolean(data.phone) ? null : { fontStyle: 'italic' }}>
                {data.phone || 'Edit Card to Add Details'}
              </Text>
            </Col>
          </Row>
          <Divider style={{ margin: '18px 0' }} />
          <Row type={'flex'} justify="space-between" align="bottom">
            <Col span={4}>
              <Text>{'Institutional Email'}</Text>
            </Col>
            <Col span={8}>
              <Text style={Boolean(data.institutionalEmail) ? null : { fontStyle: 'italic' }}>
                {data.institutionalEmail || 'Edit Card to Add Details'}
              </Text>
            </Col>
          </Row>
          <Divider style={{ margin: '18px 0' }} />
          <Row type={'flex'} justify="space-between" align="bottom">
            <Col span={4}>
              <Text>{'Zip'}</Text>
            </Col>
            <Col span={8}>
              <Text style={Boolean(data.zip) ? null : { fontStyle: 'italic' }}>
                {data.zip || 'Edit Card to Add Details'}
              </Text>
            </Col>
          </Row>
        </Col>
        <Col
          span={10}
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <FindMeReadOnly findMe={extractFindMeFromProfile(data)} />
        </Col>
      </Row>
    </Card>
  );
};

ContactReadOnly.propTypes = {
  data: PropTypes.object.isRequired,
  canEdit: PropTypes.bool.isRequired,
  onClickEditCb: PropTypes.func.isRequired,
};

export default ContactReadOnly;
