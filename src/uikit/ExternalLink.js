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
    iconSize,
    onClick = () => {},
    ...props
  }): React.Element => {
    return (
      <a
        style={{whiteSpace: "pre", ...(props.style)}}
        {...props}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${theme.externalLink} ${className} test-external-link`}
        onClick={e => {
          trackExternalLink(href);
          onClick(e);
        }}
      >
        {hasExternalIcon && <ExternalLinkIcon size={iconSize} style={{ marginRight: '0.2rem' }} />}
        {children}
      </a>
    );
  },
);
