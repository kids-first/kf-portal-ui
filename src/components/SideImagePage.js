import React from 'react';
import { kfWebRoot } from 'common/injectGlobals';
import Column from 'uikit/Column';
import Row from 'uikit/Row';

import {
  sideImagePageContainer,
  gradientBar,
  backgroundGradient,
  sideImageContainer,
  pageContent,
  logoImage,
} from './SideImagePage.module.css';

const SideImagePage = ({ logo, Component, sideImagePath, ...props }) => (
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
        {/* [NEXT] use children instead */}
        <Component {...props} />
      </Row>
    </Row>
  </Column>
);

export default SideImagePage;
