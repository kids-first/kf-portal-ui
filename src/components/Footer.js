import React from 'react';
import PropTypes from 'prop-types';
import urlJoin from 'url-join';
// [NEXT] 'react-icons' have these icons, 'react-social-icons' is not necessary here
// e.g. https://fontawesome.com/icons/twitter
import { SocialIcon } from 'react-social-icons';
import DataVersionProvider from './DataVersionProvider';

import { kfWebRoot, kfFacebook, kfTwitter, kfGithub, notionWebRoot } from 'common/injectGlobals';
import { UI_VERSION } from 'common/constants';
import Row from 'uikit/Row';

import { footerLink, footerContainer, socialIconsContainer } from './Footer.module.css';

const FooterLink = ({ href, children }) => (
  <a className={`${footerLink} greyScale0`} href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);
FooterLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element.isRequired]),
};

const socialIconSize = { width: 30, height: 30 };
const Footer = () => (
  <footer className={`${footerContainer} greyScale9`}>
    <Row>
      <FooterLink href={kfWebRoot}>kidsfirstdrc.org</FooterLink>
      {' | '}
      <FooterLink href={urlJoin(kfWebRoot, '/portal')}>About the Portal</FooterLink>
      {' | '}
      <FooterLink href={urlJoin(kfWebRoot, '/policies')}>Policies</FooterLink>
      {' | '}
      <FooterLink
        href={urlJoin(
          notionWebRoot,
          '/Kids-First-DRC-Help-Center-c26b36ff66564417834f3f264475d10a',
        )}
      >
        Support
      </FooterLink>
      {' | '}
      <FooterLink href={urlJoin(kfWebRoot, '/contact')}>Contact</FooterLink>
      {' | '}
      {`UI: ${UI_VERSION}`}
      {', '}
      {'Data Release: '}
      <DataVersionProvider />
    </Row>
    <div className={socialIconsContainer}>
      {'Follow Us'}
      <SocialIcon url={kfFacebook} style={socialIconSize} />
      <SocialIcon url={kfTwitter} style={socialIconSize} />
      <SocialIcon url={kfGithub} style={socialIconSize} />
    </div>
  </footer>
);

export default Footer;
