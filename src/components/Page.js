import React from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import styled from 'react-emotion';
import Column from 'uikit/Column';
import { applyDefaultStyles } from '../uikit/Core';

const Container = applyDefaultStyles(styled(Column)`
  position: relative;
  min-width: 1024px;
  width: 100%;
  background-repeat: repeat;
`);

const ContentWrapper = styled('div')`
  height: 100%;
  overflow-y: auto;
  & > * {
    height: 100%;
  }
`;

const Page = ({ Head = Header, Foot = Footer, Component, ...props }) => {
  return (
    <Container>
      <Head />
      <ContentWrapper>
        <Component {...props} />
        <Foot />
      </ContentWrapper>
    </Container>
  );
};

export const FixedFooterPage = ({ Head = Header, Foot = Footer, Component, ...props }) => (
  <Container height="100vh">
    <Head />
    <ContentWrapper>
      <Component {...props} />
    </ContentWrapper>
    <Foot />
  </Container>
);

export default Page;
