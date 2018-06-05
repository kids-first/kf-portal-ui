import * as React from 'react';
import { Text } from 'react-sketchapp';

const Label = ({ bold, children, style }) => (
  <Text
    style={{
      color: '#333',
      fontWeight: bold ? 'bold' : 'normal',
      fontSize: 16,
      lineHeight: 24,
      ...style
    }}
  >
    {children}
  </Text>
);

export default Label;
