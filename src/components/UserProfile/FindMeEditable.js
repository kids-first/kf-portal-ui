import React from 'react';
import { Form, Row, Space, Typography } from 'antd';
import PropTypes from 'prop-types';

import FindMeInput from 'components/UserProfile/FindMeInput';
import { socialItems } from 'components/UserProfile/utils';
import { isUrl } from 'utils';

import { ERROR_TOO_MANY_CHARACTERS, PLEASE_ENTER_A_VALID_URL } from './constants';

import './style.css';

const { Title } = Typography;

const { entries } = Object;

const URL_MAX_LENGTH = 1024;

function FindMeEditable({ setIsSaveButtonDisabledCB, findMeInitialValues }) {
  const validateInput = (rule, value) => {
    if (value && value.inputVal && value.inputVal.length > URL_MAX_LENGTH) {
      setIsSaveButtonDisabledCB(true);
      // eslint-disable-next-line no-undef
      return Promise.reject(`${ERROR_TOO_MANY_CHARACTERS} ( max: ${URL_MAX_LENGTH} ) `);
    } else if (['orchid', 'github', 'twitter'].includes(rule.field)) {
      setIsSaveButtonDisabledCB(false);
      // eslint-disable-next-line no-undef
      return Promise.resolve();
    } else if (!value || !value.inputVal || isUrl(value.inputVal)) {
      setIsSaveButtonDisabledCB(false);
      // eslint-disable-next-line no-undef
      return Promise.resolve();
    }
    setIsSaveButtonDisabledCB(true);
    // eslint-disable-next-line no-undef
    return Promise.reject(PLEASE_ENTER_A_VALID_URL);
  };

  const socialItemsWithSize = socialItems(28, 28);
  const socialIcons = entries(socialItemsWithSize).map(([serviceName, value]) => ({
    id: serviceName,
    label: value.name,
    placeHolder: value.placeholder,
    icon: value.icon,
    initialValue: findMeInitialValues[serviceName] || '',
  }));

  return (
    <div className={'find-me-social-icons-wrapper-edit'}>
      <Row className={'find-me-on-edit-label'}>
        <Title level={3}>Find me on...</Title>
      </Row>
      <Space direction={'vertical'}>
        {socialIcons.map((item) => (
          <Space direction={'horizontal'} key={item.id}>
            {item.icon}
            <Form.Item
              name={item.id}
              label={item.label}
              rules={[
                { required: false },
                () => ({
                  validator: validateInput,
                }),
              ]}
            >
              <FindMeInput item={item} />
            </Form.Item>
          </Space>
        ))}
      </Space>
    </div>
  );
}

FindMeEditable.propTypes = {
  setIsSaveButtonDisabledCB: PropTypes.func.isRequired,
  findMeInitialValues: PropTypes.object.isRequired,
};

export default FindMeEditable;
