import React from 'react';
import CheckIcon from '../../icons/CheckCircleIcon';
import ExternalLink from 'uikit/ExternalLink';

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
        <span>
          Connected to{' '}
          <ExternalLink
            href={url}
            hasExternalIcon={false}
            css={`${theme.ExternalLink}`}
          >
            {name}
          </ExternalLink>.
        </span>
      </div>
    ) : (
      unconnectedMsg
    )}
  </div>
);

export default IntegrationsStatus;
