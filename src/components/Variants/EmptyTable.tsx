import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

const EmptyMessage = () => <Text type={'secondary'}>No data available for this variant</Text>;

export default EmptyMessage;
