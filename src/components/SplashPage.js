import React from 'react';

import { splashPageContainer } from './SplashPage.module.css';

const SplashPage = ({ children, stealth = false }) => (
  <div className={splashPageContainer}>
    {stealth ? (
      children
    ) : (
      <React.Fragment>
        <h1>Kids First Data Resource Portal</h1>
        <div className="card">{children}</div>
      </React.Fragment>
    )}
  </div>
);

export default SplashPage;
