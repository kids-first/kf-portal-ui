import React from 'react';
import ExternalLink from 'uikit/ExternalLink';
import { cavaticaWebRoot } from 'common/injectGlobals';
import RightArrows from 'react-icons/lib/fa/angle-double-right';

import theme from 'theme/defaultTheme';

export const SuccessToastComponent = ({ selectedProjectData }) => (
  <div style={{ display: 'flex' }}>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: '16px' }}>Success!</div>
      <div>Files were copied to your Cavatica project:</div>
      <div style={{ color: theme.secondary, marginBottom: '20px' }}>{selectedProjectData.name}</div>
      <ExternalLink
        style={{ fontSize: '14px' }}
        href={`${cavaticaWebRoot}u/${selectedProjectData.id}`}
      >
        Open project in Cavatica
        <RightArrows fill={theme.primary} width="10px" style={{ marginLeft: '4px' }} />
      </ExternalLink>
    </div>
  </div>
);
