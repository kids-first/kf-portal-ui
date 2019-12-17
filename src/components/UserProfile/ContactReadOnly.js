import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Card, Divider, Row, Typography } from 'antd';
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

const showWhenHasDataOrCanEdit = (data, canEdit) => {
  return Boolean(data) || canEdit;
};

const DEFAULT_IF_EMPTY = 'Edit Card to Add Details';

const ContactReadOnly = props => {
  const { data, canEdit, onClickEditCb, isProfileUpdating } = props;
  const mergedAddresses = mergeAddresses(data.addressLine1, data.addressLine2);
  return (
    <Card
      {...makeCommonCardPropsReadOnly({
        isProfileUpdating,
        title: 'Contact Information',
        onClickEditCb,
        canEdit,
      })}
    >
      <div className={'find-me-main'}>
        <div className={'find-me-col-contact-info'}>
          {showWhenHasDataOrCanEdit(data.email, canEdit) && (
            <Fragment>
              <Row type={'flex'} justify="space-between" align="bottom">
                <Text type="secondary" strong>
                  {'Email'}
                </Text>
                <Text className={generateContactValueStyle(data.email)}>
                  {Boolean(data.email) ? (
                    <a href={`mailto:${data.email}`}>{data.email}</a>
                  ) : (
                    DEFAULT_IF_EMPTY
                  )}
                </Text>
              </Row>
              <Divider className={'contact.divider'} />
            </Fragment>
          )}
          {showInstitution(data) && (
            <Fragment>
              {showWhenHasDataOrCanEdit(data.institution, canEdit) && (
                <Fragment>
                  <Row type={'flex'} justify="space-between" align="bottom">
                    <Text type="secondary" strong>
                      {getInstitutionLabelGivenRole(data)}
                    </Text>
                    <Text className={generateContactValueStyle(data.institution)}>
                      {data.institution || DEFAULT_IF_EMPTY}
                    </Text>
                  </Row>
                  <Divider className={'contact-divider'} />
                </Fragment>
              )}
              {showWhenHasDataOrCanEdit(data.department, canEdit) && (
                <Fragment>
                  <Row type={'flex'} justify="space-between" align="bottom">
                    <Text type="secondary" strong>
                      {'Suborganization/Department'}
                    </Text>
                    <Text className={generateContactValueStyle(data.department)}>
                      {data.department || DEFAULT_IF_EMPTY}
                    </Text>
                  </Row>
                  <Divider className={'contact-divider'} />
                </Fragment>
              )}
              {showWhenHasDataOrCanEdit(data.institutionalEmail, canEdit) && (
                <Fragment>
                  <Row type={'flex'} justify="space-between" align="bottom">
                    <Text type="secondary" strong>
                      {'Institutional Email'}
                    </Text>
                    <Text className={generateContactValueStyle(data.institutionalEmail)}>
                      {Boolean(data.institutionalEmail) ? (
                        <a href={`mailto:${data.institutionalEmail}`}>{data.institutionalEmail}</a>
                      ) : (
                        DEFAULT_IF_EMPTY
                      )}
                    </Text>
                  </Row>
                  <Divider className={'contact-divider'} />
                </Fragment>
              )}
            </Fragment>
          )}
          {showWhenHasDataOrCanEdit(data.jobTitle, canEdit) && isResearcher(data) && (
            <Fragment>
              <Row type={'flex'} justify="space-between" align="bottom">
                <Text type="secondary" strong>
                  {'Job Title'}
                </Text>
                <Text className={generateContactValueStyle(data.jobTitle)}>
                  {data.jobTitle || DEFAULT_IF_EMPTY}
                </Text>
              </Row>
              <Divider className={'contact-divider'} />
            </Fragment>
          )}
          {showWhenHasDataOrCanEdit(mergedAddresses, canEdit) && (
            <Fragment>
              <Row type={'flex'} justify="space-between" align="bottom">
                <Text type="secondary" strong>
                  {'Address'}
                </Text>
                <Text className={generateContactValueStyle(mergedAddresses)}>
                  {mergedAddresses || DEFAULT_IF_EMPTY}
                </Text>
              </Row>
              <Divider className={'contact-divider'} />
            </Fragment>
          )}
          {showWhenHasDataOrCanEdit(data.city, canEdit) && (
            <Fragment>
              <Row type={'flex'} justify="space-between" align="bottom">
                <Text type="secondary" strong>
                  {'City'}
                </Text>
                <Text className={generateContactValueStyle(data.city)}>
                  {data.city || DEFAULT_IF_EMPTY}
                </Text>
              </Row>
              <Divider className={'contact-divider'} />
            </Fragment>
          )}
          {showWhenHasDataOrCanEdit(data.country, canEdit) && (
            <Fragment>
              <Row type={'flex'} justify="space-between" align="bottom">
                <Text type="secondary" strong>
                  {'Country'}
                </Text>
                <Text className={generateContactValueStyle(data.country)}>
                  {data.country || DEFAULT_IF_EMPTY}
                </Text>
              </Row>
              <Divider className={'contact-divider'} />
            </Fragment>
          )}
          {showWhenHasDataOrCanEdit(data.state, canEdit) && (
            <Fragment>
              <Row type={'flex'} justify="space-between" align="bottom">
                <Text type="secondary" strong>
                  {'State'}
                </Text>
                <Text className={generateContactValueStyle(data.state)}>
                  {data.state || DEFAULT_IF_EMPTY}
                </Text>
              </Row>
              <Divider className={'contact-divider'} />
            </Fragment>
          )}
          {showWhenHasDataOrCanEdit(data.phone, canEdit) && (
            <Fragment>
              <Row type={'flex'} justify="space-between" align="bottom">
                <Text type="secondary" strong>
                  {'Phone'}
                </Text>
                <Text className={generateContactValueStyle(data.phone)}>
                  {data.phone || DEFAULT_IF_EMPTY}
                </Text>
              </Row>
              <Divider className={'contact-divider'} />
            </Fragment>
          )}
          {showWhenHasDataOrCanEdit(data.zip, canEdit) && (
            <Fragment>
              <Row type={'flex'} justify="space-between" align="bottom">
                <Text type="secondary" strong>
                  {'Zip'}
                </Text>
                <Text className={generateContactValueStyle(data.zip)}>
                  {data.zip || DEFAULT_IF_EMPTY}
                </Text>
              </Row>
              <Divider className={'contact-divider'} />
            </Fragment>
          )}
        </div>
        <div className={'find-me-col-social'}>
          <FindMeReadOnly canEdit={canEdit} findMe={extractFindMeFromProfile(data)} />
        </div>
      </div>
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
