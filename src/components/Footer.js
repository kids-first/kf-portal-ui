import React from 'react';
import styled from 'react-emotion';
import { Trans } from 'react-i18next';
import urlJoin from 'url-join';
import { SocialIcon as ReactSocialIcon } from 'react-social-icons';
import { DataVersionProvider } from 'services/dataVersion';

import { kfWebRoot, kfFacebook, kfTwitter, kfGithub } from 'common/injectGlobals';
import { UI_VERSION } from 'common/constants';
import Row from 'uikit/Row';

export const footerHeight = '56px';

const FooterLink = styled('a')`
  font-family: ${({ theme }) => theme.fonts.details};
  font-size: 12px;
  line-height: 2.17;
  letter-spacing: 0.2px;
  text-align: center;
  color: ${({ theme }) => theme.greyScale0};
  text-decoration: underline;
  margin: 0 8px;
`;

const FooterContainer = styled('footer')`
  ${({ theme }) => theme.row};
  ${({ theme }) => theme.center};
  flex: none;
  height: ${footerHeight};
  width: 100%;
  background-color: #fff;
  box-shadow: 0 0 4.9px 0.1px ${({ theme }) => theme.shadow};
  font-family: ${({ theme }) => theme.fonts.details};
  font-size: 12px;
  line-height: 2.17;
  letter-spacing: 0.2px;
  color: ${({ theme }) => theme.greyScale9};
  z-index: 100;
  position: relative;
`;

const SocialIcons = styled('div')`
  position: absolute;
  right: 30px;
  ${({ theme }) => theme.center};
`;

const SocialIcon = styled(({ width = 30, height = width, ...props }) => (
  <ReactSocialIcon {...props} style={{ width, height }} />
))`
  margin-left: 10px;
`;

const Footer = () => (
  <FooterContainer>
    <Row>
      <FooterLink href={kfWebRoot} target="_blank">
        <Trans>kidsfirstdrc.org</Trans>
      </FooterLink>
      {' | '}
      <FooterLink href={urlJoin(kfWebRoot, '/portal')} target="_blank">
        <Trans>About the Portal</Trans>
      </FooterLink>
      {' | '}
      <FooterLink href={urlJoin(kfWebRoot, '/policies')} target="_blank">
        <Trans>Policies</Trans>
      </FooterLink>
      {' | '}
      <FooterLink href={urlJoin(kfWebRoot, '/support/getting-started')} target="_blank">
        <Trans>Support</Trans>
      </FooterLink>
      {' | '}
      <FooterLink href={urlJoin(kfWebRoot, '/contact')} target="_blank">
        <Trans>Contact</Trans>
      </FooterLink>
      {' | '}
      <Trans>UI:</Trans> {UI_VERSION}
      {', '}
      <Trans>Data Release: </Trans>
      <DataVersionProvider />
    </Row>
    <SocialIcons>
      <Trans>Follow Us</Trans>
      <SocialIcon url={kfFacebook} />
      <SocialIcon url={kfTwitter} />
      <SocialIcon url={kfGithub} />
    </SocialIcons>
  </FooterContainer>
);

export default Footer;
