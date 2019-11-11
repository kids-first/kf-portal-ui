import React from 'react';

import Column from 'uikit/Column';
import ExternalLink from 'uikit/ExternalLink';

import { infoLink, infoMessage } from './UserDashboard.module.css';

const Info = ({ link, message = 'Visit our website for more information on' }) => (
  <Column alignItems="center">
    <p className={infoMessage}>{message}</p>
    <ExternalLink href={link.url} hasExternalIcon={false} className={infoLink}>
      {link.text}
    </ExternalLink>
  </Column>
);
export default Info;
