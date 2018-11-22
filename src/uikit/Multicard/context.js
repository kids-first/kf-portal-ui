import React from 'react';
import { CardConsumer } from './index';

export const withCard = WrappedComponent => props => (
  <CardConsumer>{card => <WrappedComponent {...{ card, ...props }} />}</CardConsumer>
);
