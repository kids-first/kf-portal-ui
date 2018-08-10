import React from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import styled from 'react-emotion';
import Column from 'uikit/Column';
import { footerHeight } from './Footer';
const Container = styled(Column)`
  position: relative;
  height: 100vh;
  min-width: 1024px;
  width: 100%;
  background-repeat: repeat;
`;

const ContentWrapper = styled('div')`
  height: 100%;
  overflow-y: auto;
  & > * {
    height: 100%;
  }
`;

const FloatFooterPageContentWrapper = styled('div')`
  height: 100%;
  overflow-y: auto;
`;

const FloatFooterPageComponentWrapper = styled('div')`
  min-height: calc(100% - ${footerHeight});
  display: flex;
`;

const Page = ({ Head = Header, Foot = Footer, Component, ...props }) => (
  <Container>
    <Head />
    <FloatFooterPageContentWrapper>
      <FloatFooterPageComponentWrapper>
        <Component {...props} />
      </FloatFooterPageComponentWrapper>
      <Foot />
    </FloatFooterPageContentWrapper>
  </Container>
);

export const FixedFooterPage = ({ Head = Header, Foot = Footer, Component, ...props }) => (
  <Container>
    <Head />
    <ContentWrapper>
      <Component {...props} />
    </ContentWrapper>
    <Foot />
  </Container>
);

export default Page;
