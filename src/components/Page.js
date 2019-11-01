import React from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Column from 'uikit/Column';
import { applyDefaultStyles } from 'uikit/Core';

import { pageContainer } from './Page.module.css';

const Bob = ({ children, ...props }) => <Column className={pageContainer}>{children}</Column>;
const Container = applyDefaultStyles(Bob);

const FloatFooterPageContentWrapper = styled('div')`
  height: 100%;
  overflow-y: auto;
`;

const FloatFooterPageComponentWrapper = styled('div')`
  min-height: calc(100% - 56px);
  display: flex;
`;

const Page = ({ Head = Header, Foot = Footer, Component, ...props }) => (
  <Column className={pageContainer}>
    <Head />
    <FloatFooterPageContentWrapper>
      <FloatFooterPageComponentWrapper>
        <Component {...props} />
      </FloatFooterPageComponentWrapper>
      <Foot />
    </FloatFooterPageContentWrapper>
  </Column>
);

export const FixedFooterPage = ({ Head = Header, Foot = Footer, Component, ...props }) => (
  <Column className={pageContainer} height="auto">
    <Head />
    <Component {...props} />
    <Foot />
  </Column>
);

export default Page;
