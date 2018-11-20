import React from 'react';
import styled, { css } from 'react-emotion';

import Card from 'uikit/Card';
import { applyDefaultStyles } from 'uikit/Core';

import ExternalLinkIcon from 'react-icons/lib/fa/external-link';
import RightIcon from 'react-icons/lib/fa/angle-right';
import { LargeTealActionButton } from 'uikit/Button';

const cardCSS = css`
  height: 404px;
`;

export const DashboardCard = styled(Card)`
  ${cardCSS}
`;

export const DualPaneCard = styled(DashboardCard)`
  ${cardCSS}
`;

export const ConnectButton = ({ ...props }) => {
  const ExternalLink = applyDefaultStyles(ExternalLinkIcon);
  const RightArrow = applyDefaultStyles(RightIcon);

  return (
    <LargeTealActionButton {...props} maxWidth={160}>
      <ExternalLink size={12} position="relative" right={4} />
      Connect
      <RightArrow size={14} position="relative" left={10} />
    </LargeTealActionButton>
  );
};
