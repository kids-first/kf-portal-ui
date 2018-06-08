import React from 'react';
import { WidgetTitle } from './styles';

const Notifications = props => (
  <div
    css={`
      margin-left: 20px;
      flex: 3;
      padding: 10px 20px;
      border-top: 6px solid #41a7d5;
      opacity: 0;
    `}
  >
    <WidgetTitle>Notifications</WidgetTitle>
  </div>
);

export default Notifications;
