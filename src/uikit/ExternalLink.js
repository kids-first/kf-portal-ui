import React from 'react';
import { withTheme } from 'emotion-theming';
import ExternalLinkIcon from 'react-icons/lib/fa/external-link';

import { trackExternalLink } from '../services/analyticsTracking';

export default withTheme(
  ({
    children,
    hasExternalIcon = true,
    className = '',
    href,
    theme,
    onClick = () => {},
    ...props
  }): React.Element => {
    return (
      <a
        {...props}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${theme.externalLink} ${className} test-external-link`}
        onClick={() => {
          trackExternalLink(href);
          onClick();
        }}
      >
        {hasExternalIcon && <ExternalLinkIcon style={{ marginRight: '0.5rem' }} />}
        {children}
      </a>
    );
  },
);
