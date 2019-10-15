import React from 'react';
import ExternalLink from 'uikit/ExternalLink';
import { cavaticaWebRoot } from 'common/injectGlobals';
import RightArrows from 'react-icons/lib/fa/angle-double-right';

export const SuccessToastComponent = ({ theme, selectedProjectData }) => (
  <div
    css={`
      display: flex;
    `}
  >
    <div
      css={`
        display: flex;
        flex-direction: column;
      `}
    >
      <div
        css={`
          font-size: 16px;
        `}
      >
        Success!
      </div>
      <div>Files were copied to your Cavatica project:</div>
      <div
        css={`
          color: ${theme.secondary};
          margin-bottom: 20px;
        `}
      >
        {selectedProjectData.name}
      </div>
      <ExternalLink
        css={`
          font-size: 14px;
        `}
        href={`${cavaticaWebRoot}/u/${selectedProjectData.id}`}
      >
        Open project in Cavatica
        <RightArrows fill={theme.primary} width="10px" css="margin-left:4px;" />
      </ExternalLink>
    </div>
  </div>
);
