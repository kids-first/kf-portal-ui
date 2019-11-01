import React from 'react';
import { withTheme } from 'emotion-theming';
import ExternalLinkIcon from 'react-icons/lib/fa/external-link';

import { trackExternalLink } from '../services/analyticsTracking';

import { externalLink } from './ExternalLink.module.css';

export default withTheme(
  ({
    children,
    hasExternalIcon = true,
    className = '',
    href,
    iconSize,
    onClick = () => {},
    style = {},
    ...props
  }) => {
    return (
      <a
        style={{ whiteSpace: 'pre', ...style }}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${externalLink} ${className} test-external-link`}
        onClick={e => {
          trackExternalLink(href);
          onClick(e);
        }}
        {...props}
      >
        {hasExternalIcon && <ExternalLinkIcon size={iconSize} style={{ marginRight: '0.2rem' }} />}
        {children}
      </a>
    );
  },
);
