import React from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import styled from 'react-emotion';
import Column from 'uikit/Column';

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

const Page = ({ Head = Header, Foot = Footer, Component, ...props }) => (
  <Container>
    <Head />
    <ContentWrapper>
      <Component {...props} />
      <Foot />
    </ContentWrapper>
  </Container>
);

export default Page;
