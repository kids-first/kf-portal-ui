import * as React from 'react';

import Row from 'uikit/Row';
import Button from 'uikit/Button';
import CavaticaOpenModalWrapper from './CavaticaOpenModalWrapper';
import CavaticaLogo from 'icons/CavaticaLogo';

import { flexRow, flexCenter, bigWhiteButton } from '../../theme/tempTheme.module.css';
import './cavatica.css';

const CavaticaButton = ({ className = '', children, ...props }) => (
  <Button className={`cavaticaButton ${flexRow} ${bigWhiteButton} ${className}`} {...props}>
    {children}
  </Button>
);

export default ({
  disabled,
  text,
  style = {},
  fileIds,
  sqon,
  hasFilePermission,
  file,
  sourceLocation = '',
}) => (
  <CavaticaOpenModalWrapper
    fileIds={fileIds}
    sqon={sqon}
    source={{ location: sourceLocation, hasAccess: hasFilePermission, file }}
  >
    <CavaticaButton disabled={disabled} style={style}>
      <Row className={`${flexCenter} buttonContent`}>
        <CavaticaLogo
          width="20"
          height="28"
          fill={disabled ? '#cacbcf' : 'white'}
          style={{ marginRight: '7px' }}
        />
        {text}
      </Row>
    </CavaticaButton>
  </CavaticaOpenModalWrapper>
);
