import React from 'react';
import CheckIcon from '../../icons/CheckCircleIcon';

const IntegrationsStatus = ({ connected, unconnectedMsg, name, url, theme }) => (
  <div>
    {connected ? (
      <div
        css={`
          color: ${theme.active};
          display: flex;
          align-items: center;
        `}
      >
        <CheckIcon
          css={`
            width: 26px;
            margin-right: 7px;
          `}
        />
        <span>Connected to {name}</span>
      </div>
    ) : (
      unconnectedMsg
    )}
  </div>
);

export default IntegrationsStatus;
