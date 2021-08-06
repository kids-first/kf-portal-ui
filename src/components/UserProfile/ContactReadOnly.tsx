import React from 'react';
import { Card } from 'antd';

import { ProfileTodo } from '../../store/profileTypes';

import CardNoDataReadOnly from './CardNoDataReadOnly';
import ContactReadInformation from './ContactReadInformation';
import FindMeReadOnly from './FindMeReadOnly';
import {
  extractFindMeFromProfile,
  extractRoleFromProfile,
  isResearcher,
  makeCommonCardPropsReadOnly,
  showInstitution,
  showWhenHasDataOrCanEdit,
} from './utils';

import './style.css';

type Props = {
  data: ProfileTodo;
  canEdit: boolean;
  isProfileUpdating: boolean;
  onClickEditCb: () => void;
};

const getInstitutionLabelGivenRole = (data: ProfileTodo) => {
  const role = extractRoleFromProfile(data);
  if (role === 'research') {
    return 'Institution';
  } else if (role === 'community') {
    return 'Institution/Organization';
  }
  return '';
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

const hasData = (data: ProfileTodo) => {
  if (!data) {
    return false;
  }

  const role = extractRoleFromProfile(data);

  let fieldsToCheckFor = [...COMMON_PROPERTIES];
  if (role === 'research') {
    fieldsToCheckFor = [...fieldsToCheckFor, ...RESEARCHER_SPECIFIC_PROPERTIES];
  } else if (role === 'community') {
    fieldsToCheckFor = [...fieldsToCheckFor, ...COMMUNITY_SPECIFIC_PROPERTIES];
  }
  return fieldsToCheckFor.some((f) => data[f as keyof ProfileTodo]);
};

const ContactReadOnly = (props: Props) => {
  const { data, canEdit, onClickEditCb, isProfileUpdating } = props;
  if (!hasData(data)) {
    return (
      <CardNoDataReadOnly
        title={'Contact Information'}
        onClickEditCb={onClickEditCb}
        canEdit={canEdit}
        isProfileUpdating={isProfileUpdating}
      />
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
    .map((e) => e && e.trim())
    .filter(Boolean)
    .join(', ');

  const role = extractRoleFromProfile(data);

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
            <ContactReadInformation fieldLabel={'Email'} fieldValue={data.email} isEmail />
          )}
          {showInstitution(role) && (
            <>
              {showWhenHasDataOrCanEdit(data.institution, canEdit) && (
                <ContactReadInformation
                  fieldLabel={getInstitutionLabelGivenRole(data)}
                  fieldValue={data.institution}
                />
              )}
              {showWhenHasDataOrCanEdit(data.department, canEdit) && (
                <ContactReadInformation
                  fieldLabel={'Suborganization/Department'}
                  fieldValue={data.department}
                />
              )}
              {showWhenHasDataOrCanEdit(data.institutionalEmail, canEdit) && (
                <ContactReadInformation
                  fieldLabel={'Institutional Email'}
                  fieldValue={data.institutionalEmail}
                  isEmail
                />
              )}
            </>
          )}
          {showWhenHasDataOrCanEdit(data.jobTitle, canEdit) && isResearcher(role) && (
            <ContactReadInformation fieldLabel={'Job Title'} fieldValue={data.jobTitle} />
          )}
          {showWhenHasDataOrCanEdit(mergedAddresses, canEdit) && (
            <ContactReadInformation fieldLabel={'Address'} fieldValue={mergedAddresses} />
          )}
          {showWhenHasDataOrCanEdit(data.zip, canEdit) && (
            <ContactReadInformation fieldLabel={'Zip'} fieldValue={data.zip} />
          )}
          {showWhenHasDataOrCanEdit(data.phone, canEdit) && (
            <ContactReadInformation fieldLabel={'Phone'} fieldValue={data.phone} />
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

export default ContactReadOnly;
