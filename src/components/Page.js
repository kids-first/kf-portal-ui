import React from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Column from 'uikit/Column';
import { Layout } from 'antd';

import { pageContainer, layoutContainer } from './Page.module.css';

const { Content, Footer: Ft } = Layout;

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
  <Layout className={layoutContainer}>
    <Head />
    <Content
      style={{
        display: 'flex',
        alignItems: 'stretch',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <Component {...props} />
    </Content>
    <Ft style={{ padding: '0' }}>
      <Foot />
    </Ft>
  </Layout>
);

export default Page;
