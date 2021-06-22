import React from 'react';
import { FacebookFilled, GithubFilled, TwitterSquareFilled } from '@ant-design/icons';
import urlJoin from 'url-join';

import { UI_VERSION } from 'common/constants';
import { kfFacebook, kfGithub, kfTwitter, kfWebRoot, notionWebRoot } from 'common/injectGlobals';
import styleThemeColors from 'style/themes/default/colors.module.scss';
import Row from 'uikit/Row';

import DataVersionProvider from './DataVersionProvider';
import FooterLink from './FooterLink';

import { footerContainer, footerLink, socialIconsContainer } from './Footer.module.css';

const socialIconFontSize = '30px';

const Footer = () => (
  <footer className={`${footerContainer} greyScale9`}>
    <Row>
      <FooterLink href={kfWebRoot} className={footerLink}>
        kidsfirstdrc.org
      </FooterLink>
      {' | '}
      <FooterLink href={urlJoin(kfWebRoot, '/portal')} className={footerLink}>
        About the Portal
      </FooterLink>
      {' | '}
      <FooterLink href={urlJoin(kfWebRoot, '/policies')} className={footerLink}>
        Policies
      </FooterLink>
      {' | '}
      <FooterLink
        href={urlJoin(
          notionWebRoot,
          '/Kids-First-DRC-Help-Center-c26b36ff66564417834f3f264475d10a',
        )}
        className={footerLink}
      >
        Support
      </FooterLink>
      {' | '}
      <FooterLink href={urlJoin(kfWebRoot, '/contact')} className={footerLink}>
        Contact
      </FooterLink>
      {' | '}
      {`UI: ${UI_VERSION}`}
      {', '}
      {'Data Release: '}
      <DataVersionProvider />
    </Row>
    <div className={socialIconsContainer}>
      {'Follow Us'}
      <a target="_blank" rel="noopener noreferrer" href={kfFacebook}>
        <FacebookFilled
          style={{ fontSize: socialIconFontSize, color: styleThemeColors.facebookColor }}
        />
      </a>
      <a target="_blank" rel="noopener noreferrer" href={kfTwitter}>
        <TwitterSquareFilled
          style={{ fontSize: socialIconFontSize, color: styleThemeColors.twitterColor }}
        />
      </a>
      <a target="_blank" rel="noopener noreferrer" href={kfGithub}>
        <GithubFilled
          style={{ fontSize: socialIconFontSize, color: styleThemeColors.githubColor }}
        />
      </a>
    </div>
  </footer>
);

export default Footer;
