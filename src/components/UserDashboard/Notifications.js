import React from 'react';
import { H3 } from './styles';

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
    <H3
      css={`
        margin-top: 6px;
        font-weight: 400;
      `}
    >
      Notifications
    </H3>
  </div>
);

export default Notifications;
