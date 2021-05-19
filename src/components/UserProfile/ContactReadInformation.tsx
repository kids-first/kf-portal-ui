import React from 'react';
import { Divider, Typography } from 'antd';

import { EDIT_CARD_TO_ADD_DETAILS } from './constants';

const { Text } = Typography;

type FieldValue = string | undefined;

type Props = {
  fieldLabel: string;
  fieldValue: FieldValue;
  isEmail?: boolean;
};

const generateContactValueStyle = (info: FieldValue) => (info ? '' : 'contact-info-value');

const convertValueToEmailLinkIfNeeded = (value: FieldValue, isEmail: boolean) => {
  if (isEmail && value) {
    return <a href={`mailto:${value}`}>{value}</a>;
  }
  return value;
};

const ContactReadInformation = ({ fieldLabel, fieldValue, isEmail = false }: Props) => (
  <>
    <div className={'contact-grid'}>
      <Text className={'contact-info-title'}>{fieldLabel}</Text>
      <Text className={generateContactValueStyle(fieldValue)}>
        {convertValueToEmailLinkIfNeeded(fieldValue, isEmail) || EDIT_CARD_TO_ADD_DETAILS}
      </Text>
    </div>
    <Divider className={'contact-divider'} />
  </>
);

export default ContactReadInformation;
