import React from 'react';
import styled, { css } from 'react-emotion';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';

const FooterLink = styled.a`
  font-family: 'Open Sans';
  font-size: 12px;
  line-height: 2.17;
  letter-spacing: 0.2px;
  text-align: center;
  color: ${({ theme }) => theme.greyScale0};
  text-decoration: underline;
`;

const Footer = compose(withTheme)(({ theme }) => (
  <footer
    className={`${theme.column} ${css`
      height: 84px;
      background-color: #ffffff;
      box-shadow: 0 0 4.9px 0.1px #bbbbbb;
      font-family: OpenSans;
      font-size: 12px;
      line-height: 2.17;
      letter-spacing: 0.2px;
      text-align: center;
      color: #343434;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      z-index: 100;
      flex: none;
    `}`}
  >
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
    <div
      css={`
        color: #74757d;
      `}
    >
      <Trans>Data Release - </Trans>
      <Trans i18nKey="dataReleaseVersion">Unreleased</Trans>
    </div>
  </footer>
));

export default Footer;
