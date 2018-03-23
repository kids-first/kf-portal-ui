import React from 'react';
import styled, { css } from 'react-emotion';

const FooterLink = styled.a`
  font-family: 'Open Sans';
  font-size: 12px;
  line-height: 2.17;
  letter-spacing: 0.2px;
  text-align: center;
  color: ${({ theme }) => theme.greyScale0};
  text-decoration: underline;
`;

const Footer = () => (
  <footer
    className={css`
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
      display: flex;
      flex-direction: column;
      flex: none;
    `}
  >
    <div>
      <FooterLink>Kids First Website</FooterLink> | <FooterLink>Contact Us</FooterLink> |{' '}
      <FooterLink>Policies</FooterLink> | <FooterLink>Accessibility</FooterLink> |{' '}
      <FooterLink>FOIA</FooterLink>
    </div>
    <div
      css={`
        color: #74757d;
      `}
    >
      Data Release - Unreleased
    </div>
  </footer>
);

export default Footer;
