import React from 'react';
import { StyledH3 } from './styles';

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
    <StyledH3
      css={`
        margin-top: 6px;
        font-weight: 400;
      `}
    >
      Notifications
    </StyledH3>
  </div>
);

export default Notifications;
