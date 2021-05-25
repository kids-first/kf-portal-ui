import React from 'react';
import { Card, Typography } from 'antd';

import { EDIT_CARD_TO_ADD_DETAILS } from './constants';
import { makeCommonCardPropsReadOnly } from './utils';

const { Text } = Typography;

type Props = {
  title: string;
  isProfileUpdating: boolean;
  canEdit: boolean;
  onClickEditCb: () => void;
};

const CardNoDataReadOnly = ({ title, isProfileUpdating, onClickEditCb, canEdit }: Props) => (
  <Card
    {...makeCommonCardPropsReadOnly({
      isProfileUpdating,
      title,
      onClickEditCb,
      canEdit,
    })}
  >
    <Text className={'contact-info-value'}>{canEdit ? EDIT_CARD_TO_ADD_DETAILS : 'No Data'}</Text>
  </Card>
);

export default CardNoDataReadOnly;
