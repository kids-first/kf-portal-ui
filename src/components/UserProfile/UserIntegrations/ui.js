import * as React from 'react';
import styled from 'react-emotion';
import Pencil from 'react-icons/lib/fa/pencil';
import View from 'react-icons/lib/fa/eye';
import X from 'react-icons/lib/fa/close';
import { Trans } from 'react-i18next';

import { ActionButton, WhiteButton } from 'uikit/Button';
import { applyDefaultStyles, Span } from 'uikit/Core';
import StackIcon from 'icons/StackIcon';
import ExternalLinkIcon from 'react-icons/lib/fa/external-link';
import RightIcon from 'react-icons/lib/fa/angle-right';

/* === ConnectButton === */
const ConnectButtonWrapper = styled(ActionButton)`
  font-size: 14px;
  background: ${({ theme }) => theme.lightBlue};
`;
const ExternalLink = applyDefaultStyles(ExternalLinkIcon);
const RightArrow = applyDefaultStyles(RightIcon);

export const ConnectButton = ({ text = 'Connect', ...props }) => {
  return (
    <ConnectButtonWrapper {...props} maxWidth={160}>
      <ExternalLink size={14} position="relative" right={4} /> <Trans>{text}</Trans>
      <RightArrow size={14} position="relative" left={4} />
    </ConnectButtonWrapper>
  );
};

const connectedButtonCommonStyles = `
  padding: 0px 10px;
  font-size: 12px;
  height: auto;
`;

/* === AuthorizedStudiesButton === */
const StudiesButtonWrapper = styled(ActionButton)`
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.white};
  &:hover {
    background: ${({ theme }) => theme.primaryHover};
  }
  ${connectedButtonCommonStyles}
`;
const Stack = applyDefaultStyles(StackIcon);

export const AuthorizedStudiesButton = ({ text = 'Authorized Studies', ...props }) => {
  return (
    <StudiesButtonWrapper {...props}>
      <Span mr={`5px`} mt={`5px`}>
        <Stack height={15} />
      </Span>
      {text}
    </StudiesButtonWrapper>
  );
};

/* === DisconnectButton === */
const DisconnectButtonWrapper = styled(WhiteButton)`
  ${connectedButtonCommonStyles}
`;

export const DisconnectButton = ({ text = 'Disconnect', ...props }) => {
  return (
    <DisconnectButtonWrapper {...props}>
      <XIcon />
      {text}
    </DisconnectButtonWrapper>
  );
};

export const LoadingSpinner = ({ width = 11, height = 11 }) => (
  <Spinner
    fadeIn="none"
    name="circle"
    color="black"
    style={{
      width,
      height,
    }}
  />
);

export const PencilIcon = props => <Pencil className={'icon'} {...props} />;
export const ViewIcon = props => <View className={'icon'} {...props} />;
export const XIcon = props => <X className={'icon'} {...props} />;
