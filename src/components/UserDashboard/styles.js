import React from 'react';
import styled, { css } from 'react-emotion';
import { withProps } from 'recompose';

import Card from 'uikit/Card';
import { applyDefaultStyles } from 'uikit/Core';

import ExternalLinkIcon from 'react-icons/lib/fa/external-link';
import RightIcon from 'react-icons/lib/fa/angle-right';
import { TealActionButton } from 'uikit/Button';
import LoadingSpinner from 'uikit/LoadingSpinner';
import Spinner from 'react-spinkit';
import {
  PromptMessageContainer as PMCont,
  PromptMessageHeading as PMHeading,
  PromptMessageContent as PMContent,
} from 'uikit/PromptMessage';

const cardCSS = css`
  height: 404px;
`;

export const DashboardCard = styled(Card)`
  ${cardCSS}
`;

export const DualPaneCard = styled(DashboardCard)`
  ${cardCSS}
`;

const LoadingScreenContainer = styled('div')`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.5;
`;
export const CardContentSpinner = () => (
  <LoadingScreenContainer>
    <Spinner
      name="circle"
      style={{
        width: 50,
        height: 50,
      }}
    />
  </LoadingScreenContainer>
);

const Connect = styled(TealActionButton)`
  height: 37px;
  padding-right: 21px;
  padding-left: 21px;
  font-size: 14px;
  border-radius: 18px;
`;

export const ConnectButton = ({ external = true, ...props }) => {
  const ExternalLink = applyDefaultStyles(ExternalLinkIcon);
  const RightArrow = applyDefaultStyles(RightIcon);

  return (
    <Connect {...props} maxWidth={160}>
      {external ? <ExternalLink size={12} position="relative" right={5} /> : null}
      Connect
      <RightArrow size={14} position="relative" left={5} />
    </Connect>
  );
};

export const NoteList = styled('ul')`
  padding-left: 18px;
`;
export const NotePoints = styled('li')`
  margin-top: 5px;
`;

export const PromptMessageContainer = styled(PMCont)``;

export const PromptMessageHeading = styled(PMHeading)`
  font-family: ${({ theme }) => theme.fonts.default};
  font-weight: 500;
  font-size: 16px;
`;

export const PromptMessageContent = styled(PMContent)`
  font-family: ${({ theme }) => theme.fonts.details};
  font-size: 14px;
  line-height: normal;
`;
