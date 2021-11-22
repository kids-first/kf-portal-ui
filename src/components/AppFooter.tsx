import React from 'react';

import ExternalLink from 'uikit/ExternalLink';

import styles from './AppFooter.module.scss';

const AppFooter = () => (
  <div className={styles.appFooter}>
    <ExternalLink href="https://netlify.com" hasExternalIcon={false} iconSize={undefined}>
      <img
        src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
        alt="Deploys by Netlify"
      />
    </ExternalLink>
  </div>
);

export default AppFooter;
