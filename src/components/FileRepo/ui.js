import * as React from 'react';

import ControlledAccessIcon from 'icons/ControlledAccessIcon';
import { flexCenter } from 'theme/tempTheme.module.css';
import Row from 'uikit/Row';

import './FileRepo.scss';

export const ControlledIcon = ({ className = '', ...props }) => (
  <ControlledAccessIcon {...props} className={`controlledAccessIcon ${className}`} />
);

export const SaveShareButtonContainer = ({ style = {}, children, ...props }) => (
  <Row className={flexCenter} style={{ padding: '10px 5px', ...style }} {...props}>
    {children}
  </Row>
);

export const OpenIcon = () => (
  <img
    src={require('../../assets/icon-open-access.svg')}
    alt=""
    style={{
      width: '10px',
      margin: 'auto',
      display: 'block',
    }}
  />
);
