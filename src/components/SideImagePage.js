import React from 'react';
import { kfWebRoot } from 'common/injectGlobals';
import styled from 'react-emotion';
import Column from 'uikit/Column';
import Row from 'uikit/Row';

const PageContainer = styled(Column)`
  position: relative;
  height: 100vh;
  overflow-y: hidden;
  min-width: 1024;
  background-image: url(${({ backgroundImage }) => backgroundImage});
`;

const GradientBar = styled('div')`
  width: 100%;
  height: 5px;
  background-image: linear-gradient(to right, #90278e, #cc3399 35%, #be1e2d 66%, #f6921e);
`;

const Background = styled(Row)`
  background-repeat: repeat;
  height: 100%;
  width: 100%;
  background-image: linear-gradient(to bottom, #fff 400px, transparent 100%);
`;

const SideImage = styled('div')`
  background: ${({ theme }) => theme.white};
  background-image: url(${({ image }) => image});
  background-repeat: no-repeat;
  background-position: bottom;
  width: 573px;
  height: 100%;
  box-shadow: 0 0 6px 0.1px #bbbbbb;
`;

const PageContent = styled(Row)`
  justify-content: center;
  align-items: center;
  flex: 1;
  overflow: scroll;
  min-width: 830px;
`;

const LogoImage = styled('img')`
  width: 275px;
  position: absolute;
  margin: 20px;
`;

const SideImagePage = ({ backgroundImage, logo, Component, sideImage, ...props }) => (
  <PageContainer backgroundImage={backgroundImage}>
    <GradientBar />
    <a href={kfWebRoot}>
      <LogoImage src={logo} alt="Kids First Logo" />
    </a>
    <Background>
      <SideImage image={sideImage} />
      <PageContent>
        <Component {...props} />
      </PageContent>
    </Background>
  </PageContainer>
);

export default SideImagePage;
