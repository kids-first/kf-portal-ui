import React, { ReactElement } from 'react';

type OwnProps = {
  href: string;
  children: ReactElement;
  className?: string;
};

const FooterLink = ({ href, children, className = '' }: OwnProps) => (
  <a className={`${className} greyScale0`} href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

export default FooterLink;
