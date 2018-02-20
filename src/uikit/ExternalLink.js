import React from 'react';
import ExternalLinkIcon from 'react-icons/lib/fa/external-link';

export default function ExternalLink({
  children,
  hasExternalIcon = true,
  className = '',
  ...props
}): React.Element {
  return (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className={className + ' test-external-link'}
    >
      {hasExternalIcon && <ExternalLinkIcon style={{ marginRight: '0.5rem' }} />}
      {children}
    </a>
  );
}
