import React from 'react';
import styled from 'react-emotion';
import { Trans } from 'react-i18next';
import urlJoin from 'url-join';
import { SocialIcon as ReactSocialIcon } from 'react-social-icons';

import { kfWebRoot, kfFacebook, kfTwitter, kfGithub } from 'common/injectGlobals';
import { UI_VERSION } from 'common/constants';

const FooterLink = styled('a')`
  font-family: ${({ theme }) => theme.fonts.details};
  font-size: 12px;
  line-height: 2.17;
  letter-spacing: 0.2px;
  text-align: center;
  color: ${({ theme }) => theme.greyScale0};
  text-decoration: underline;
`;

const FooterContainer = styled('footer')`
  ${({ theme }) => theme.row};
  ${({ theme }) => theme.center};
  flex: none;
  height: 84px;
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

const Details = styled('div')`
  ${({ theme }) => theme.column};
  ${({ theme }) => theme.center};
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
    <Details>
      <div>
        <FooterLink href={kfWebRoot}>
          <Trans>Kids First Website</Trans>
        </FooterLink>
        {' | '}
        <FooterLink href={urlJoin(kfWebRoot, '/contact')}>
          <Trans>Contact Us</Trans>
        </FooterLink>
        {' | '}
        <FooterLink href={urlJoin(kfWebRoot, '/policies')}>
          <Trans>Policies</Trans>
        </FooterLink>
      </div>
      <div>
        <Trans>UI:</Trans> {UI_VERSION}
        {', '}
        <Trans>Data Release: </Trans>
        <Trans i18nKey="dataReleaseVersion">Pre-release</Trans>
      </div>
    </Details>
    <SocialIcons>
      <Trans>Follow Us</Trans>
      <SocialIcon url={kfFacebook} />
      <SocialIcon url={kfTwitter} />
      <SocialIcon url={kfGithub} />
    </SocialIcons>
  </FooterContainer>
);

export default Footer;
