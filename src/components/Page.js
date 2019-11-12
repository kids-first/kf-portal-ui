import React from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Column from 'uikit/Column';

import { pageContainer } from './Page.module.css';

const Page = ({ Head = Header, Foot = Footer, Component, ...props }) => (
  <Column className={pageContainer}>
    <Head />
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
      }}
    >
      <Component {...props} />
      <Foot />
    </div>
  </Column>
);

export const FixedFooterPage = ({ Head = Header, Foot = Footer, Component, ...props }) => (
  <Column className={pageContainer} style={{ height: 'auto' }}>
    <Head />
    <Component {...props} />
    <Foot />
  </Column>
);

export default Page;
