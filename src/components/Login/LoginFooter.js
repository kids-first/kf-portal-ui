import React from 'react';
import ExternalLink from 'uikit/ExternalLink';

export default () => (
  <div className="login-footer">
    <ExternalLink href="https://netlify.com" hasExternalIcon={false}>
      <img
        src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
        alt="Deploys by Netlify"
      />
    </ExternalLink>
  </div>
);
