import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {Form, Row, Select} from 'antd';
import {ROLES} from 'common/constants';
import ContactEditablePlacesAutoComplete from './ContactEditablePlacesAutoComplete';

//TODO gravatar + Validating
const { Option } = Select;

class ContactInformationEditable extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    parentForm: PropTypes.object.isRequired,
  };

  setNewAddress = address => {
    console.log('setNewAddress address', address);
  };

  render() {
    const { data, parentForm } = this.props;
    const { getFieldDecorator } = parentForm;
    console.log('data => ', data); //TODO <=====
    return (
      <Fragment>
        <Row>
          <Form.Item label="Title">
            <Select defaultValue={data.title}>
              <Option value="">N/A</Option>
              <Option value="mr">Mr.</Option>
              <Option value="ms">Ms.</Option>
              <Option value="mrs">Mrs.</Option>
              <Option value="dr">Dr.</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Profile Type">
            <Select defaultValue={data.roles[0]}>
              {ROLES.map(({ type, displayName }) => (
                <Option value={type} key={type}>
                  {displayName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Row>
        <Row>
          <Form.Item label={'Search Location'}>
            {getFieldDecorator('addressInput', {
              initialValue: data.addressLine1,
              rules: [{ required: false }],
            })(
              <ContactEditablePlacesAutoComplete
                setAddressCb={this.setNewAddress}
              />,
            )}
          </Form.Item>
        </Row>
      </Fragment>
    );
  }
}

export default ContactInformationEditable;
