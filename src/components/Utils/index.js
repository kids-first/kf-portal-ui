import React from 'react';
import { SizeMe } from 'react-sizeme';

export const SizeProvider = props => <SizeMe refreshRate={100} {...props} />;
export const withSize = Wrapped => props => (
  <SizeProvider>{({ size }) => <Wrapped size={size} {...props} />}</SizeProvider>
);
