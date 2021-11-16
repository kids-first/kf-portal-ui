import React from 'react';

import { kfWebRoot } from 'common/injectGlobals';
import Column from 'uikit/Column';
import Row from 'uikit/Row';

import {
  backgroundGradient,
  gradientBar,
  logoImage,
  pageContent,
  sideImageContainer,
  sideImagePageContainer,
} from './SideImagePage.module.css';

const SideImagePage = ({ logo, Component, sideImagePath, Footer = null, ...props }) => (
  <Column className={sideImagePageContainer}>
    <div className={gradientBar} />
    <a href={kfWebRoot}>
      <img className={logoImage} src={logo} alt="Kids First Logo" />
    </a>
    <Row className={backgroundGradient}>
      <div
        className={sideImageContainer}
        style={{
          backgroundImage: `url(${sideImagePath})`,
        }}
      />
      <Row className={pageContent}>
        <Component {...props} />
        {Footer ? <Footer {...props} /> : null}
      </Row>
    </Row>
  </Column>
);

export default SideImagePage;
