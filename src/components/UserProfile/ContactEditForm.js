import React, { useState } from 'react';
import { Card, Col, Row, Form } from 'antd';
import PropTypes from 'prop-types';
import ContactInformationEditable from 'components/UserProfile/ContactInformationEditable';
import FindMeEditable from './FindMeEditable';
import './style.css';
import { findMeFields } from './constants';
import { makeCommonCardPropsEditing } from 'components/UserProfile/utils';
import { socialItems } from 'components/UserProfile/utils';

const { entries } = Object;

const buildInitialValuesForFindMe = profile =>
  entries(socialItems()).reduce(
    (acc, [serviceName]) => ({
      ...acc,
      key: { inputVal: profile[serviceName], protocol: '' },
    }),
    {},
  );

const reshapeForProfile = fields =>
  entries(fields).reduce(
    (acc, [key, value]) => {
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

const ContactEditForm = props => {
  const [form] = Form.useForm();
  const { onClickSaveCb, updateProfileCb, data, onClickCancelCb, isProfileUpdating } = props;
  const { getFieldValue } = form;

  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false);
  const [selectedRole, updateSelectedRole] = useState({ roles: data.roles[0] });

  const handleSubmit = formFields => {
    updateProfileCb(reshapeForProfile(formFields));
    onClickSaveCb();
  };

  return (
    <Form
      name={'contact_form'}
      form={form}
      layout={'vertical'}
      initialValues={{
        title: data.title,
        roles: data.roles[0],
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
        ...buildInitialValuesForFindMe(data),
      }}
      className={'form-card'}
      onFinish={handleSubmit}
      onFieldsChange={props => {
        /*
         * Some fields are hidden according to the role.
         * E.g : role researcher has more fields than community.
         * So, if someone's role is community but is changed in the form to researcher,
         * than make sure fields for researcher shows up dynamically.
         * */
        const hasRolesFieldChanged = (props[0]?.name || []).includes('roles');
        if (hasRolesFieldChanged) {
          const roleValueFromForm = getFieldValue('roles');
          const hasRoleChanged = roleValueFromForm !== selectedRole;
          if (hasRoleChanged) {
            updateSelectedRole({ roles: [roleValueFromForm] });
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
            <FindMeEditable setIsSaveButtonDisabledCB={setIsSaveButtonDisabled} />
          </Col>
        </Row>
      </Card>
    </Form>
  );
};

ContactEditForm.propTypes = {
  data: PropTypes.object.isRequired,
  onClickCancelCb: PropTypes.func.isRequired,
  onClickSaveCb: PropTypes.func.isRequired,
  isProfileUpdating: PropTypes.bool.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  updateProfileCb: PropTypes.func.isRequired,
};

export default ContactEditForm;
