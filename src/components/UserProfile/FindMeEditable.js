import React from 'react';
import PropTypes from 'prop-types';
import { socialItems } from 'components/UserProfile/utils';
import { Form, Input, Row } from 'antd';
import { isUrl } from 'utils';

const validateInput = (rule, value, callback) => {
  if (rule.field === 'orchid') {
    callback();
  } else if (!value || isUrl(value)) {
    callback();
  }
  callback('Invalid Url');
};

function FindMeEditable(props) {
  const { entries } = Object;
  const socialItemsWithSized = socialItems(18, 18);
  const socialIcons = entries(socialItemsWithSized).map(([key, value]) => {
    return {
      id: key,
      label: value.name,
      placeHolder: value.placeholder,
      icon: value.icon,
    };
  });

  const { parentForm, data } = props;
  const { getFieldDecorator } = parentForm;

  return (
    <div style={{ borderLeft: '1px solid rgb(237,238,241)', paddingLeft: '48px' }}>
      {socialIcons.map(item => {
        return (
          <Row key={item.id}>
            <Form.Item label={item.label}>
              {getFieldDecorator(item.id, {
                initialValue: data[item.id],
                rules: [
                  { required: false },
                  {
                    validator: validateInput,
                  },
                ],
              })(<Input prefix={item.icon} placeholder={item.placeHolder} />)}
            </Form.Item>
          </Row>
        );
      })}
    </div>
  );
}

FindMeEditable.propTypes = {
  parentForm: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default FindMeEditable;
