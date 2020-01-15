import React from 'react';
import PropTypes from 'prop-types';
import { socialItems } from 'components/UserProfile/utils';
import { Form, Row, Typography } from 'antd';
import { isUrl } from 'utils';
import './style.css';
import FindMeInput from 'components/UserProfile/FindMeInput';
import { ERROR_INVALID_URL, ERROR_TOO_MANY_CHARACTERS } from './constants';

const { Title } = Typography;

const URL_MAX_LENGTH = 1024;

const validateInput = (rule, value, callback) => {
  if (value && value.inputVal && value.inputVal.length > URL_MAX_LENGTH) {
    return callback(ERROR_TOO_MANY_CHARACTERS);
  } else if (['orchid', 'github', 'twitter'].includes(rule.field)) {
    return callback();
  } else if (!value || !value.inputVal || isUrl(value.inputVal)) {
    return callback();
  }
  return callback(ERROR_INVALID_URL);
};

function FindMeEditable(props) {
  const { entries } = Object;
  const socialItemsWithSize = socialItems(28, 28);
  const socialIcons = entries(socialItemsWithSize).map(([key, value]) => {
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
    <div className={'find-me-social-icons-wrapper-edit'}>
      <Row className={'find-me-on-edit-label'}>
        <Title level={3}>Find me on...</Title>
      </Row>
      {socialIcons.map(item => {
        return (
          <Row key={item.id} type={'flex'} align={'middle'}>
            <div className={'fmi-icon-wrapper'}>{item.icon}</div>
            <Form.Item label={item.label}>
              {getFieldDecorator(item.id, {
                initialValue: { inputVal: data[item.id], protocol: '' },
                rules: [
                  { required: false },
                  {
                    validator: validateInput,
                  },
                ],
              })(<FindMeInput item={item} />)}
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
