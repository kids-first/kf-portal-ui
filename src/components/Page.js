import React from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import styled from 'react-emotion';
import Column from 'uikit/Column';

const Container = styled(Column)`
  height: ${({ fixedHeightPage }) => (fixedHeightPage ? '100vh' : 'auto')};
  position: relative;
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

const Page = ({ Head = Header, Foot = Footer, Component, styles, fixedHeightPage, ...props }) => {
  console.log('ciaran', fixedHeightPage);
  return (
    <Container fixedHeightPage={fixedHeightPage}>
      <Head />
      <ContentWrapper>
        <Component {...props} />
        <Foot />
      </ContentWrapper>
    </Container>
  );
};

export const FixedFooterPage = ({
  Head = Header,
  Foot = Footer,
  Component,
  fixedHeightPage,
  ...props
}) => (
  <Container fixedHeightPage={fixedHeightPage}>
    <Head />
    <ContentWrapper>
      <Component {...props} />
    </ContentWrapper>
    <Foot />
  </Container>
);

export default Page;
