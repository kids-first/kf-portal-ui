import React from 'react';
import Spinner from 'react-spinkit';
import ExternalLinkIcon from 'react-icons/lib/fa/external-link';
import RightIcon from 'react-icons/lib/fa/angle-right';

import Card from 'uikit/Card';
import { TealActionButton } from 'uikit/Button';
import {
  PromptMessageContainer as PMCont,
  PromptMessageHeading as PMHeading,
  PromptMessageContent as PMContent,
} from 'uikit/PromptMessage';
import Multicard from 'uikit/Multicard';

import { styleComponent } from 'components/Utils';

import {
  dashboardCard,
  loadingScreenContainer,
  cardActionButton,
  promptMessageContainer,
  promptMessageContent,
  promptMessageHeading,
} from './UserDashboard.module.css';

export const DashboardCard = styleComponent(Card, dashboardCard);
export const DashboardMulticard = styleComponent(Multicard, dashboardCard);

export const CardContentSpinner = () => (
  <div className={loadingScreenContainer}>
    <Spinner
      name="circle"
      style={{
        width: 50,
        height: 50,
      }}
    />
  </div>
);

export const CardActionButton = styleComponent(TealActionButton, cardActionButton);

export const ConnectButton = ({ external = true, ...props }) => (
  <CardActionButton {...props} maxWidth={160}>
    {external ? <ExternalLinkIcon size={12} position="relative" right={5} /> : null}
    Connect
    <RightIcon size={14} position="relative" left={5} />
  </CardActionButton>
);

export const PromptMessageContainer = styleComponent(PMCont, promptMessageContainer);
export const PromptMessageContent = styleComponent(PMContent, promptMessageContent);
export const PromptMessageHeading = styleComponent(PMHeading, promptMessageHeading);
