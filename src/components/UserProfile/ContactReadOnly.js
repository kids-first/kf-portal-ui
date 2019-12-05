import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {Card, Col, Divider, Form, Input, Row, Typography} from 'antd';
import FindMeReadOnly from './FindMeReadOnly';
import {
  extractFindMeFromProfile,
  isResearcher,
  showInstitution,
  makeCommonCardPropsReadOnly,
} from './utils';
import './style.css';

const { Text } = Typography;

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

const mergeAddresses = (a1, a2) => {
  if (a1 && a2) {
    return `${a1}, ${a2}`;
  }
  return a1 || a2;
};

const DEFAULT_IF_EMPTY = 'Edit Card to Add Details';

const ContactReadOnly = props => {
  const { data, canEdit, onClickEditCb, isProfileUpdating } = props;
  return (
    <Card
      {...makeCommonCardPropsReadOnly({
        isProfileUpdating,
        title: 'Contact Information',
        onClickEditCb,
        canEdit,
      })}
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
          {showInstitution(data) && (
            <Fragment>
              <Row type={'flex'} justify="space-between" align="bottom">
                <Col span={4}>
                  <Text type="secondary" strong>
                    {getInstitutionLabelGivenRole(data)}
                  </Text>
                </Col>
                <Col span={8} className={'contact-col-value'}>
                  <Text className={generateContactValueStyle(data.institution)}>
                    {data.institution || DEFAULT_IF_EMPTY}
                  </Text>
                </Col>
              </Row>
              <Divider className={'contact-divider'} />
              <Row type={'flex'} justify="space-between" align="bottom">
                <Col span={4}>
                  <Text type="secondary" strong>
                    {'Suborganization/Department'}
                  </Text>
                </Col>
                <Col span={8} className={'contact-col-value'}>
                  <Text className={generateContactValueStyle(data.department)}>
                    {data.department || DEFAULT_IF_EMPTY}
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
                    {Boolean(data.institutionalEmail) ? (
                      <a href={`mailto:${data.institutionalEmail}`}>{data.institutionalEmail}</a>
                    ) : (
                      DEFAULT_IF_EMPTY
                    )}
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
                {'Address'}
              </Text>
            </Col>
            <Col span={8} className={'contact-col-value'}>
              <Text
                className={generateContactValueStyle(
                  mergeAddresses(data.addressLine1, data.addressLine2),
                )}
              >
                {mergeAddresses(data.addressLine1, data.addressLine2) || DEFAULT_IF_EMPTY}
              </Text>
            </Col>
          </Row>
          <Divider className={'contact-divider'} />
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
          <FindMeReadOnly canEdit={canEdit} findMe={extractFindMeFromProfile(data)} />
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
