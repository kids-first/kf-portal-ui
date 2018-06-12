// @flow
import * as React from 'react';
import { View, Text } from 'react-sketchapp';
import Badge from './Badge';

const CodeSnippet = ({ children, filled, syntax, style }) => (
  <View style={{ ...style }}>
    <Badge filled={true} style={{ maxWidth: 50, position: 'absolute', top: -10, zIndex: 2 }}>
      {syntax && syntax}
    </Badge>
    <View
      style={{
        zIndex: 1,
        position: 'relative',
        flexDirection: 'row',
        marginBottom: 24,
        padding: 15,
        borderRadius: 5,
        backgroundColor: '#edeef1',
      }}
    >
      <Text style={{ fontFamily: 'Mono', fontWeight: 'bold' }}>{children}</Text>
    </View>
  </View>
);

export default CodeSnippet;
