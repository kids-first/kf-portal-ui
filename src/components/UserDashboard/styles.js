import React from 'react';
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
  promptMessageContainer,
  promptMessageContent,
  promptMessageHeading,
  cardLink,
  noteList,
} from './UserDashboard.module.css';

export const DashboardCard = styleComponent(Card, dashboardCard);
export const DashboardMulticard = styleComponent(Multicard, dashboardCard);

export const CardLink = styleComponent('a', cardLink);

export const ConnectButton = ({ external = true, ...props }) => (
  <TealActionButton maxWidth={160} {...props}>
    {external ? <ExternalLinkIcon size={12} position="relative" right={5} /> : null}
    Connect
    <RightIcon size={14} position="relative" left={5} />
  </TealActionButton>
);

export const NoteList = styleComponent('ul', noteList);

export const PromptMessageContainer = styleComponent(PMCont, promptMessageContainer);
export const PromptMessageContent = styleComponent(PMContent, promptMessageContent);
export const PromptMessageHeading = styleComponent(PMHeading, promptMessageHeading);
