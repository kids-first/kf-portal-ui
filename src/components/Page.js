import React from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import styled from 'react-emotion';
import Column from 'uikit/Column';
import { footerHeight } from './Footer';
import { applyDefaultStyles } from 'uikit/Core';

const Container = applyDefaultStyles(styled(Column)`
  position: relative;
  height: 100vh;
  width: 100%;
  background-repeat: repeat;
`);

const FloatFooterPageContentWrapper = styled('div')`
  height: 100%;
  overflow-y: auto;
`;

const FloatFooterPageComponentWrapper = styled('div')`
  min-height: calc(100% - ${footerHeight});
  display: flex;
`;

const Page = ({
  Head = Header,
  Foot = Footer,
  Component,
  cssFloatFooterPageComponentWrapper = ``,
  ...props
}) => (
  <Container>
    <Head />
    <FloatFooterPageContentWrapper>
      <FloatFooterPageComponentWrapper css={cssFloatFooterPageComponentWrapper}>
        <Component {...props} />
      </FloatFooterPageComponentWrapper>
      <Foot />
    </FloatFooterPageContentWrapper>
  </Container>
);

export const FixedFooterPage = ({ Head = Header, Foot = Footer, Component, ...props }) => (
  <Container height="auto">
    <Head />
    <Component {...props} />
    <Foot />
  </Container>
);

export default Page;
