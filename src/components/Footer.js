import React from 'react';
import { css } from 'react-emotion';

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
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      z-index: 100;
    `}
  >
    footer placeholder text
  </footer>
);

export default Footer;
