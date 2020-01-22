import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Card, Divider, Typography } from 'antd';
import FindMeReadOnly from './FindMeReadOnly';
import {
  extractFindMeFromProfile,
  isResearcher,
  showInstitution,
  makeCommonCardPropsReadOnly,
  showWhenHasDataOrCanEdit,
} from './utils';
import './style.css';
import { EDIT_CARD_TO_ADD_DETAILS } from './constants';

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

const COMMUNITY_SPECIFIC_PROPERTIES = ['institution', 'department', 'institutionalEmail'];

const RESEARCHER_SPECIFIC_PROPERTIES = [
  'jobTitle',
  'institution',
  'department',
  'institutionalEmail',
];
const COMMON_PROPERTIES = [
  'email',
  'zip',
  'phone',
  'addressLine1',
  'addressLine2',
  'city',
  'state',
  'country',
];

const hasData = data => {
  const role = data.roles[0];
  let fieldsToCheckFor = COMMON_PROPERTIES;
  if (role === 'research') {
    fieldsToCheckFor = fieldsToCheckFor.concat(RESEARCHER_SPECIFIC_PROPERTIES);
  } else if (role === 'community') {
    fieldsToCheckFor = fieldsToCheckFor.concat(COMMUNITY_SPECIFIC_PROPERTIES);
  }
  return fieldsToCheckFor.some(f => Boolean(data[f]));
};

const ContactReadOnly = props => {
  const { data, canEdit, onClickEditCb, isProfileUpdating } = props;
  if (!hasData(data)) {
    return (
      <Card
        {...makeCommonCardPropsReadOnly({
          isProfileUpdating,
          title: 'Contact Information',
          onClickEditCb,
          canEdit,
        })}
      >
        <Text className={'contact-info-value'}>
          {canEdit ? EDIT_CARD_TO_ADD_DETAILS : 'No Data'}
        </Text>
      </Card>
    );
  }

  const findMeData = extractFindMeFromProfile(data);
  const hasFindMe = Object.keys(findMeData).length > 0;
  const mergedAddresses = [
    data.addressLine1,
    data.addressLine2,
    data.city,
    data.state,
    data.country,
  ]
    .map(e => e && e.trim())
    .filter(Boolean)
    .join(', ');

  return (
    <Card
      {...makeCommonCardPropsReadOnly({
        isProfileUpdating,
        title: 'Contact Information',
        onClickEditCb,
        canEdit,
      })}
    >
      <div className={'contact-main'}>
        <div className={'find-me-col-contact-info'}>
          {showWhenHasDataOrCanEdit(data.email, canEdit) && (
            <Fragment>
              <div className={'contact-grid'}>
                <Text className={'contact-info-title'}>{'Email'}</Text>
                <Text className={generateContactValueStyle(data.email)}>
                  {Boolean(data.email) ? (
                    <a href={`mailto:${data.email}`}>{data.email}</a>
                  ) : (
                    EDIT_CARD_TO_ADD_DETAILS
                  )}
                </Text>
              </div>
              <Divider className={'contact-divider'} />
            </Fragment>
          )}
          {showInstitution(data) && (
            <Fragment>
              {showWhenHasDataOrCanEdit(data.institution, canEdit) && (
                <Fragment>
                  <div className={'contact-grid'}>
                    <Text className={'contact-info-title'}>
                      {getInstitutionLabelGivenRole(data)}
                    </Text>
                    <Text className={generateContactValueStyle(data.institution)}>
                      {data.institution || EDIT_CARD_TO_ADD_DETAILS}
                    </Text>
                  </div>
                  <Divider className={'contact-divider'} />
                </Fragment>
              )}
              {showWhenHasDataOrCanEdit(data.department, canEdit) && (
                <Fragment>
                  <div className={'contact-grid'}>
                    <Text className={'contact-info-title'}>{'Suborganization/Department'}</Text>
                    <Text className={generateContactValueStyle(data.department)}>
                      {data.department || EDIT_CARD_TO_ADD_DETAILS}
                    </Text>
                  </div>
                  <Divider className={'contact-divider'} />
                </Fragment>
              )}
              {showWhenHasDataOrCanEdit(data.institutionalEmail, canEdit) && (
                  <Fragment>
                    <div className={'contact-grid'}>
                      <Text className={'contact-info-title'}>{'Institutional Email'}</Text>
                      <Text className={generateContactValueStyle(data.institutionalEmail)}>
                        {Boolean(data.institutionalEmail) ? (
                            <a href={`mailto:${data.institutionalEmail}`}>{data.institutionalEmail}</a>
                        ) : (
                            EDIT_CARD_TO_ADD_DETAILS
                        )}
                      </Text>
                    </div>
                    <Divider className={'contact-divider'} />
                  </Fragment>
              )}
            </Fragment>
          )}
          {showWhenHasDataOrCanEdit(data.jobTitle, canEdit) && isResearcher(data) && (
            <Fragment>
              <div className={'contact-grid'}>
                <Text className={'contact-info-title'}>{'Job Title'}</Text>
                <Text className={generateContactValueStyle(data.jobTitle)}>
                  {data.jobTitle || EDIT_CARD_TO_ADD_DETAILS}
                </Text>
              </div>
              <Divider className={'contact-divider'} />
            </Fragment>
          )}
          {showWhenHasDataOrCanEdit(mergedAddresses, canEdit) && (
            <Fragment>
              <div className={'contact-grid'}>
                <Text className={'contact-info-title'}>{'Address'}</Text>
                <Text className={generateContactValueStyle(mergedAddresses)}>
                  {mergedAddresses || EDIT_CARD_TO_ADD_DETAILS}
                </Text>
              </div>
              <Divider className={'contact-divider'} />
            </Fragment>
          )}
          {showWhenHasDataOrCanEdit(data.zip, canEdit) && (
            <Fragment>
              <div className={'contact-grid'}>
                <Text className={'contact-info-title'}>{'Zip'}</Text>
                <Text className={generateContactValueStyle(data.zip)}>
                  {data.zip || EDIT_CARD_TO_ADD_DETAILS}
                </Text>
              </div>
              <Divider className={'contact-divider'} />
            </Fragment>
          )}
          {showWhenHasDataOrCanEdit(data.phone, canEdit) && (
            <Fragment>
              <div className={'contact-grid'}>
                <Text className={'contact-info-title'}>{'Phone'}</Text>
                <Text className={generateContactValueStyle(data.phone)}>
                  {data.phone || EDIT_CARD_TO_ADD_DETAILS}
                </Text>
              </div>
              <Divider className={'contact-divider'} />
            </Fragment>
          )}
        </div>
        {(hasFindMe || canEdit) && (
          <div className={'find-me-col-social'}>
            <FindMeReadOnly findMe={findMeData} />
          </div>
        )}
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
