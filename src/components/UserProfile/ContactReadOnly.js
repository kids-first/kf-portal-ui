import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col, Divider, Row, Typography } from 'antd';
import FindMeReadOnly from './FindMeReadOnly';
import { extractFindMeFromProfile } from './utils';
import './style.css';
import style from './style';

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

const generateContactValueStyle = info => {
  return Boolean(info) ? '' : 'contact-info-value';
};

const DEFAULT_IF_EMPTY = 'Edit Card to Add Details';

const ContactReadOnly = props => {
  const { data, canEdit, onClickEditCb, isProfileUpdating } = props;
  return (
    <Card
      loading={isProfileUpdating}
      title={
        <Title level={3} strong>
          Contact Information
        </Title>
      }
      className={'card'}
      bodyStyle={style.cardBodyStyle}
      extra={
        canEdit ? (
          <Button type="primary" icon="edit" shape="round" onClick={onClickEditCb}>
            Edit
          </Button>
        ) : null
      }
    >
      <Row>
        <Col span={14} className={'main-left-col'}>
          <Row type={'flex'} justify="space-between" align="bottom">
            <Col span={4}>
              <Text type="secondary" strong>
                {'Email'}
              </Text>
            </Col>
            <Col span={8} className={'contact-col-value'}>
              <Text className={generateContactValueStyle(data.email)}>
                {Boolean(data.email) ? (
                  <a href={`mailto:${data.email}`}>{data.email}</a>
                ) : (
                  DEFAULT_IF_EMPTY
                )}
              </Text>
            </Col>
          </Row>
          <Divider className={'contact.divider'} />
          <Row type={'flex'} justify="space-between" align="bottom">
            <Col span={4}>
              <Text type="secondary" strong>
                {'Address'}
              </Text>
            </Col>
            <Col span={8} className={'contact-col-value'}>
              <Text className={generateContactValueStyle(data.addressLine1)}>
                {data.addressLine1 || DEFAULT_IF_EMPTY}
              </Text>
            </Col>
          </Row>
          <Divider className={'contact-divider'} />
          {showInstitution(data) && (
            <Fragment>
              <Row type={'flex'} justify="space-between" align="bottom">
                <Col span={4}>
                  <Text type="secondary" strong>
                    {'Institution'}
                  </Text>
                </Col>
                <Col span={8} className={'contact-col-value'}>
                  <Text className={generateContactValueStyle(data.institution)}>
                    {getInstitutionLabelGivenRole(data) || DEFAULT_IF_EMPTY}
                  </Text>
                </Col>
              </Row>
              <Divider className={'contact-divider'} />
            </Fragment>
          )}
          {isResearcher(data) && (
            <Fragment>
              <Row type={'flex'} justify="space-between" align="bottom">
                <Col span={4}>
                  <Text type="secondary" strong>
                    {'Job Title'}
                  </Text>
                </Col>
                <Col span={8} className={'contact-col-value'}>
                  <Text className={generateContactValueStyle(data.jobTitle)}>
                    {data.jobTitle || DEFAULT_IF_EMPTY}
                  </Text>
                </Col>
              </Row>
              <Divider className={'contact-divider'} />
            </Fragment>
          )}
          <Row type={'flex'} justify="space-between" align="bottom">
            <Col span={4}>
              <Text type="secondary" strong>
                {'City'}
              </Text>
            </Col>
            <Col span={8} className={'contact-col-value'}>
              <Text className={generateContactValueStyle(data.city)}>
                {data.city || DEFAULT_IF_EMPTY}
              </Text>
            </Col>
          </Row>
          <Divider className={'contact-divider'} />
          <Row type={'flex'} justify="space-between" align="bottom">
            <Col span={4}>
              <Text type="secondary" strong>
                {'Country'}
              </Text>
            </Col>
            <Col span={8} className={'contact-col-value'}>
              <Text className={generateContactValueStyle(data.country)}>
                {data.country || DEFAULT_IF_EMPTY}
              </Text>
            </Col>
          </Row>
          <Divider className={'contact-divider'} />
          <Row type={'flex'} justify="space-between" align="bottom">
            <Col span={4}>
              <Text type="secondary" strong>
                {'State'}
              </Text>
            </Col>
            <Col span={8} className={'contact-col-value'}>
              <Text className={generateContactValueStyle(data.state)}>
                {data.state || DEFAULT_IF_EMPTY}
              </Text>
            </Col>
          </Row>
          <Divider className={'contact-divider'} />
          <Row type={'flex'} justify="space-between" align="bottom">
            <Col span={4}>
              <Text type="secondary" strong>
                {'Phone'}
              </Text>
            </Col>
            <Col span={8} className={'contact-col-value'}>
              <Text className={generateContactValueStyle(data.phone)}>
                {data.phone || DEFAULT_IF_EMPTY}
              </Text>
            </Col>
          </Row>
          <Divider className={'contact-divider'} />
          <Row type={'flex'} justify="space-between" align="bottom">
            <Col span={4}>
              <Text type="secondary" strong>
                {'Institutional Email'}
              </Text>
            </Col>
            <Col span={8} className={'contact-col-value'}>
              <Text className={generateContactValueStyle(data.institutionalEmail)}>
                {data.institutionalEmail || DEFAULT_IF_EMPTY}
              </Text>
            </Col>
          </Row>
          <Divider className={'contact-divider'} />
          <Row type={'flex'} justify="space-between" align="bottom">
            <Col span={4}>
              <Text type="secondary" strong>
                {'Zip'}
              </Text>
            </Col>
            <Col span={8} className={'contact-col-value'}>
              <Text className={generateContactValueStyle(data.zip)}>
                {data.zip || DEFAULT_IF_EMPTY}
              </Text>
            </Col>
          </Row>
        </Col>
        <Col span={10} className={'find-me-col'}>
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
