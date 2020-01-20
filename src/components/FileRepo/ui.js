import * as React from 'react';
import Spinner from 'react-spinkit';

// [NEXT] beagle import moved to ./index.css
import '@kfarranger/components/public/themeStyles/beagle/beagle.css';

import Row from 'uikit/Row';
import ControlledAccessIcon from 'icons/ControlledAccessIcon';

import { flexCenter } from 'theme/tempTheme.module.css';
import './FileRepo.css';

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

export const TableSpinner = ({ props, style = {} }) => (
  <Spinner
    fadeIn="none"
    name="circle"
    color="#a9adc0"
    style={{ width: 50, height: 60, ...style }}
    {...props}
  />
);