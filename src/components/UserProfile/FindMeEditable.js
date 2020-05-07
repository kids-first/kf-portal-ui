import React from 'react';
import PropTypes from 'prop-types';
import { socialItems } from 'components/UserProfile/utils';
import { Row, Typography, Form } from 'antd';
import { isUrl } from 'utils';
import './style.css';
import FindMeInput from 'components/UserProfile/FindMeInput';
import { PLEASE_ENTER_A_VALID_URL, ERROR_TOO_MANY_CHARACTERS } from './constants';

const { Title } = Typography;

const { entries } = Object;

const URL_MAX_LENGTH = 1024;

function FindMeEditable({ setIsSaveButtonDisabledCB }) {
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
  const socialIcons = entries(socialItemsWithSize).map(([key, value]) => ({
    id: key,
    label: value.name,
    placeHolder: value.placeholder,
    icon: value.icon,
  }));

  return (
    <div className={'find-me-social-icons-wrapper-edit'}>
      <Row className={'find-me-on-edit-label'}>
        <Title level={3}>Find me on...</Title>
      </Row>
      {socialIcons.map(item => (
        <Row key={item.id} type={'flex'} align={'middle'}>
          <div className={'fmi-icon-wrapper'}>{item.icon}</div>
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
        </Row>
      ))}
    </div>
  );
}

FindMeEditable.propTypes = {
  setIsSaveButtonDisabledCB: PropTypes.func.isRequired,
};

export default FindMeEditable;
