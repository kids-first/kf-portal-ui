import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Input, Select, Typography, Form } from 'antd';
import { ROLES } from 'common/constants';
import ContactEditablePlacesAutoComplete from './ContactEditablePlacesAutoComplete';
import AddressEditForm from 'components/UserProfile/AddressEditForm';
import './style.css';
import { isResearcher, showInstitution } from './utils';
import { ERROR_TOO_MANY_CHARACTERS } from './constants';

const { fromEntries, entries } = Object;

const { Option } = Select;

const { Text } = Typography;

const MAX_LENGTH_FIELD = 100;

const ContactInformationEditable = props => {
  const { setIsSaveButtonDisabledCB, data, parentForm, selectedRole } = props;
  const { setFieldsValue } = parentForm;

  const validateFields = (rule, value) => {
    if (value && value.length > MAX_LENGTH_FIELD) {
      setIsSaveButtonDisabledCB(true);
      // eslint-disable-next-line no-undef
      return Promise.reject(`${ERROR_TOO_MANY_CHARACTERS} ( max: ${MAX_LENGTH_FIELD} ) `);
    }
    setIsSaveButtonDisabledCB(false);
    // eslint-disable-next-line no-undef
    return Promise.resolve();
  };

  return (
    <Fragment>
      <div>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Select size={'small'}>
            <Option value="">N/A</Option>
            <Option value="mr">Mr.</Option>
            <Option value="ms">Ms.</Option>
            <Option value="mrs">Mrs.</Option>
            <Option value="dr">Dr.</Option>
          </Select>
        </Form.Item>
        <Form.Item name="roles" label="Profile Type" rules={[{ required: true }]}>
          <Select size={'small'}>
            {ROLES.map(({ type, displayName }) => (
              <Option value={type} key={type}>
                {displayName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Input.Group>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[
              { required: true, message: 'first name is required' },
              () => ({
                validator: validateFields,
              }),
            ]}
          >
            <Input size="small" />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="last Name"
            rules={[
              { required: true, message: 'last name is required' },
              () => ({
                validator: validateFields,
              }),
            ]}
          >
            <Input size="small" />
          </Form.Item>
          {showInstitution(selectedRole) && (
            <Fragment>
              <Form.Item
                name="institution"
                label="Institution/Organization"
                rules={[
                  { required: true },
                  () => ({
                    validator: validateFields,
                  }),
                ]}
              >
                <Input size="small" />
              </Form.Item>
            </Fragment>
          )}
          <Form.Item
            name="department"
            label="Suborganization/Department"
            rules={[
              { required: false },
              () => ({
                validator: validateFields,
              }),
            ]}
          >
            <Input size="small" />
          </Form.Item>
          {showInstitution(selectedRole) && (
            <Fragment>
              <Form.Item
                name="institutionalEmail"
                label="Institutional Email Address"
                rules={[
                  { required: false },
                  () => ({
                    validator: validateFields,
                  }),
                ]}
              >
                <Input size="small" />
              </Form.Item>
            </Fragment>
          )}
          {isResearcher(selectedRole) && (
            <Fragment>
              <Form.Item
                name="jobTitle"
                label="Job Title"
                rules={[
                  { required: false },
                  () => ({
                    validator: validateFields,
                  }),
                ]}
              >
                <Input size="small" />
              </Form.Item>
            </Fragment>
          )}
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: false },
              () => ({
                validator: validateFields,
              }),
            ]}
          >
            <Input size="small" />
          </Form.Item>

          <Form.Item
            name="eraCommonsID"
            label="ERA Commons ID"
            rules={[
              { required: false },
              () => ({
                validator: validateFields,
              }),
            ]}
          >
            <Input size="small" />
          </Form.Item>
        </Input.Group>
      </div>
      <div>
        <Text>Search Location</Text>
        <ContactEditablePlacesAutoComplete
          setAddressCb={address => {
            const addressWithNonEmptyFields = fromEntries(
              entries(address).filter(([, value]) => Boolean(value)),
            );
            setFieldsValue({ ...addressWithNonEmptyFields, addressLine2: undefined });
          }}
        />
      </div>
      <div className={'contact-edit-address-wrapper'}>
        <AddressEditForm
          parentForm={parentForm}
          validateFieldsCB={validateFields}
          addressLine1={data.addressLine1}
          addressLine2={data.addressLine2}
          city={data.city}
          country={data.country}
          state={data.state}
          zip={data.zip}
        />
      </div>
    </Fragment>
  );
};

ContactInformationEditable.propTypes = {
  data: PropTypes.shape({
    roles: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    phone: PropTypes.string,
    institution: PropTypes.string,
    department: PropTypes.string,
    eraCommonsID: PropTypes.string,
    institutionalEmail: PropTypes.string,
    addressLine1: PropTypes.string,
    addressLine2: PropTypes.string,
    city: PropTypes.string,
    country: PropTypes.string,
    state: PropTypes.string,
    zip: PropTypes.string,
  }).isRequired,
  setIsSaveButtonDisabledCB: PropTypes.func.isRequired,
  parentForm: PropTypes.shape({
    setFieldsValue: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
  }),
  selectedRole: PropTypes.object.isRequired,
};

export default ContactInformationEditable;
