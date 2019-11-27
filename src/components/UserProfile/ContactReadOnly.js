import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col, Divider, Row, Typography } from 'antd';
import FindMeReadOnly from './FindMeReadOnly';
import { extractFindMeFromProfile } from './utils';

const { Text, Title } = Typography;

const isResearcher = data => {
  return data.roles[0] === 'research';
};

const isCommunity = data => {
  return data.roles[0] === 'community';
};

const showInstitution = data => {
  return isResearcher(data) || isCommunity(data);
};

const getInstitutionLabelGivenRole = data => {
  const role = data.roles[0];
  if (role === 'research') {
    return 'Institution';
  } else if (role === 'community') {
    return 'Institution/Organization';
  }
  return '';
};

const ContactReadOnly = props => {
  const { data, canEdit, onClickEditCb, isProfileUpdating } = props;
  return (
    <Card
      loading={isProfileUpdating}
      title={
        <Title level={1} style={{ marginBottom: 0 }}>
          Contact Information
        </Title>
      }
      style={{
        width: '1200px',
      }}
      bodyStyle={{
        padding: '32px',
      }}
      extra={
        canEdit ? (
          <Button
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
            </Col>
            <Col span={8}>
              <Text style={Boolean(data.addressLine1) ? null : { fontStyle: 'italic' }}>
                {data.addressLine1 || 'Edit Card to Add Details'}
              </Text>
            </Col>
          </Row>
          <Divider style={{ margin: '18px 0' }} />
          {showInstitution(data) && (
            <Fragment>
              <Row type={'flex'} justify="space-between" align="bottom">
                <Col span={4}>
                  <Text>{'Institution'}</Text>
                </Col>
                <Col span={8}>
                  <Text style={Boolean(data.institution) ? null : { fontStyle: 'italic' }}>
                    {getInstitutionLabelGivenRole(data) || 'Edit Card to Add Details'}
                  </Text>
                </Col>
              </Row>
              <Divider style={{ margin: '18px 0' }} />
            </Fragment>
          )}
          {isResearcher(data) && (
            <Fragment>
              <Row type={'flex'} justify="space-between" align="bottom">
                <Col span={4}>
                  <Text>{'Job Title'}</Text>
                </Col>
                <Col span={8}>
                  <Text style={Boolean(data.jobTitle) ? null : { fontStyle: 'italic' }}>
                    {data.jobTitle || 'Edit Card to Add Details'}
                  </Text>
                </Col>
              </Row>
              <Divider style={{ margin: '18px 0' }} />
            </Fragment>
          )}
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
  isProfileUpdating: PropTypes.bool.isRequired,
};

export default ContactReadOnly;
