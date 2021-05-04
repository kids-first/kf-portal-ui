import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

export const DISPLAY_WHEN_EMPTY_DATUM = '--';

const EmptyMessage = () => <Text type={'secondary'}>No data available for this variant</Text>;

export default EmptyMessage;
