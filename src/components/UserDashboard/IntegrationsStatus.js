import React from 'react';
import CheckIcon from 'react-icons/lib/fa/check-circle';
import ExternalLink from 'uikit/ExternalLink';

const IntegrationsStatus = ({ connected, unconnectedMsg, name, url, theme }) => (
  <div>
    {connected ? (
      <div
        css={`
          color: ${theme.active};
        `}
      >
        <CheckIcon size={20} />
        Connected to <ExternalLink href={url}>{name}</ExternalLink>.
      </div>
    ) : (
      unconnectedMsg
    )}
  </div>
);

export default IntegrationsStatus;
