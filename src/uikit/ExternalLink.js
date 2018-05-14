import React from 'react';
import ExternalLinkIcon from 'react-icons/lib/fa/external-link';
import { trackExternalLink } from '../services/analyticsTracking';

export default function ExternalLink({
  children,
  hasExternalIcon = true,
  className = '',
  href,
  ...props
}): React.Element {
  return (
    <a
      {...props}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className + ' test-external-link'}
      onClick={() => trackExternalLink(href)}
    >
      {hasExternalIcon && <ExternalLinkIcon style={{ marginRight: '0.5rem' }} />}
      {children}
    </a>
  );
}
