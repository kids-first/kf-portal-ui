import React from 'react';
import styled from 'react-emotion';
import { Trans } from 'react-i18next';

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
  ${({ theme }) => theme.column};
  height: 84px;
  width: 100%;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  box-shadow: 0 0 4.9px 0.1px ${({ theme }) => theme.shadow};
  font-family: ${({ theme }) => theme.fonts.details};
  font-size: 12px;
  line-height: 2.17;
  letter-spacing: 0.2px;
  text-align: center;
  color: ${({ theme }) => theme.greyScale9};
  z-index: 100;
  flex: none;
`;

const Footer = () => (
  <FooterContainer>
    <div>
      <FooterLink>
        <Trans>Kids First Website</Trans>
      </FooterLink>{' '}
      |{' '}
      <FooterLink>
        <Trans>Contact Us</Trans>
      </FooterLink>{' '}
      |{' '}
      <FooterLink>
        <Trans>Policies</Trans>
      </FooterLink>{' '}
      |{' '}
      <FooterLink>
        <Trans>Accessibility</Trans>
      </FooterLink>{' '}
      |{' '}
      <FooterLink>
        <Trans>FOIA</Trans>
      </FooterLink>
    </div>
    <div>
      <Trans>Data Release - </Trans>
      <Trans i18nKey="dataReleaseVersion">Unreleased</Trans>
    </div>
  </FooterContainer>
);

export default Footer;
