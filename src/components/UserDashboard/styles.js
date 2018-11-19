import React from 'react';
import styled from 'react-emotion';

import Card from 'uikit/Card';
import { applyDefaultStyles } from 'uikit/Core';

import ExternalLink from 'uikit/ExternalLink';
import ExternalLinkIcon from 'react-icons/lib/fa/external-link';
import RightIcon from 'react-icons/lib/fa/angle-right';
import CheckIcon from 'react-icons/lib/fa/check-circle';
import Spinner from 'react-spinkit';
import { WhiteButton, LargeTealActionButton } from 'uikit/Button';

export const DashboardCard = styled(Card)`
  height: 404px;
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
