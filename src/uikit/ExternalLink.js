import React from 'react';
import ExternalLinkIcon from 'react-icons/lib/fa/external-link';

import { trackExternalLink } from '../services/analyticsTracking';

import { externalLink, externalLinkIcon } from './ExternalLink.module.css';

export default ({
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
      style={style}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${externalLink} ${className}`}
      onClick={e => {
        trackExternalLink(href);
        onClick(e);
      }}
      {...props}
    >
      {hasExternalIcon && <ExternalLinkIcon className={externalLinkIcon} size={iconSize} />}
      {children}
    </a>
  );
};
