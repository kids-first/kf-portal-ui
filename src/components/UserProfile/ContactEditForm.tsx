import React, { useState } from 'react';
import { Card, Col, Form, Row } from 'antd';

import ContactInformationEditable from 'components/UserProfile/ContactInformationEditable';
import { extractRoleFromProfile, makeCommonCardPropsEditing } from 'components/UserProfile/utils';
import { socialItems } from 'components/UserProfile/utils';
import { ProfileTodo } from 'store/profileTypes';

import { findMeFields } from './constants';
import FindMeEditable from './FindMeEditable';

import './style.css';

const { entries } = Object;

enum Service {
  website = 'website',
  googleScholarId = 'googleScholarId',
  linkedin = 'linkedin',
  facebook = 'facebook',
  twitter = 'twitter',
  github = 'github',
  orchid = 'orchid',
}

type FindMeInput = {
  linkedin: { inputVal: string };
  orchid: { inputVal: string };
  twitter: { inputVal: string };
  website: { inputVal: string };
  googleScholarId: { inputVal: string };
  github: { inputVal: string };
  facebook: { inputVal: string };
};

type SubProfile = Pick<
  ProfileTodo,
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'country'
  | 'department'
  | 'eraCommonsID'
  | 'firstName'
  | 'institution'
  | 'institutionalEmail'
  | 'jobTitle'
  | 'lastName'
  | 'phone'
  | 'roles'
  | 'state'
  | 'title'
  | 'zip'
>;

type FormFields = SubProfile | FindMeInput;

const buildInitialValuesForFindMe = (profile: ProfileTodo) =>
  entries(socialItems()).reduce(
    (acc, [serviceName]) => ({
      ...acc,
      [serviceName]: { inputVal: profile[serviceName as Service] },
    }),
    {},
  );

const reshapeForProfile = (fields: FormFields) =>
  entries(fields).reduce(
    (acc: any, [key, value]) => {
      if (key === 'roles' && !Array.isArray(value)) {
        return {
          ...acc,
          roles: [value],
        };
      }
      if (findMeFields.includes(key)) {
        return {
          ...acc,
          [key]: (value || {}).inputVal,
        };
      }
      return acc;
    },
    { ...fields },
  );

type Props = {
  onClickSaveCb: () => void;
  updateProfileCb: (profile: ProfileTodo) => void;
  data: ProfileTodo;
  onClickCancelCb: () => void;
  isProfileUpdating: boolean;
};

const ContactEditForm = (props: Props) => {
  const [form] = Form.useForm();
  const { onClickSaveCb, updateProfileCb, data, onClickCancelCb, isProfileUpdating } = props;
  const { getFieldValue } = form;

  const role = extractRoleFromProfile(data);

  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false);
  const [selectedRole, updateSelectedRole] = useState(role);

  const handleSubmit = (formFields: FormFields) => {
    updateProfileCb(reshapeForProfile(formFields));
    onClickSaveCb();
  };

  const findMeInitialValues = buildInitialValuesForFindMe(data);

  return (
    <Form
      name={'contact_form'}
      form={form}
      layout={'vertical'}
      initialValues={{
        title: data.title,
        roles: role,
        firstName: data.firstName,
        lastName: data.lastName,
        institution: data.institution,
        department: data.department,
        institutionalEmail: data.institutionalEmail,
        jobTitle: data.jobTitle,
        phone: data.phone,
        eraCommonsID: data.eraCommonsID,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        zip: data.zip,
        country: data.country,
        ...findMeInitialValues,
      }}
      className={'form-card'}
      onFinish={handleSubmit}
      onFieldsChange={(props) => {
        /*
         * Some fields are hidden according to the role.
         * E.g : role researcher has more fields than community.
         * So, if someone's role is community but is changed in the form to researcher,
         * than make sure fields for researcher shows up dynamically.
         * */
        const fieldNameBeingTouched = (props[0]?.name || []) as string[];
        const hasRolesFieldChanged = fieldNameBeingTouched.includes('roles');
        if (hasRolesFieldChanged) {
          const roleValueFromForm = getFieldValue('roles');
          const hasRoleChanged = roleValueFromForm !== selectedRole;
          if (hasRoleChanged) {
            updateSelectedRole(roleValueFromForm);
          }
        }
      }}
    >
      <Card
        {...makeCommonCardPropsEditing({
          title: 'Contact Information',
          onClickCancelCb,
          isProfileUpdating,
          disableSaveButton: isSaveButtonDisabled,
        })}
      >
        <Row>
          <Col span={12} className={'main-left-col'}>
            <ContactInformationEditable
              data={data}
              setIsSaveButtonDisabledCB={setIsSaveButtonDisabled}
              parentForm={form}
              selectedRole={selectedRole}
            />
          </Col>
          <Col span={12} className={'find-me-col'}>
            <FindMeEditable
              setIsSaveButtonDisabledCB={setIsSaveButtonDisabled}
              findMeInitialValues={findMeInitialValues}
            />
          </Col>
        </Row>
      </Card>
    </Form>
  );
};

export default ContactEditForm;
