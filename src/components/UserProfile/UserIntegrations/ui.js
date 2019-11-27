import * as React from 'react';

import { injectState } from 'freactal';
import styled from 'react-emotion';
import ExternalLinkIcon from 'react-icons/lib/fa/external-link';
import Pencil from 'react-icons/lib/fa/pencil';
import RightIcon from 'react-icons/lib/fa/angle-right';
import X from 'react-icons/lib/fa/close';
import { compose } from 'recompose';

import { ActionButton, WhiteButton } from 'uikit/Button';
import { applyDefaultStyles, Span } from 'uikit/Core';
import StackIcon from 'icons/StackIcon';

import { withApi } from 'services/api';

/* === ConnectButton === */
const ConnectButtonWrapper = styled(ActionButton)`
  font-size: 14px;
  background: ${({ theme }) => theme.lightBlue};
`;

export { ConnectButtonWrapper };

const ExternalLink = applyDefaultStyles(ExternalLinkIcon);
const RightArrow = applyDefaultStyles(RightIcon);

export const ConnectButton = compose(
  withApi,
  injectState,
)(({ text = 'Connect', doConnect, api, effects, ...props }) => {
  return (
    <ConnectButtonWrapper maxWidth={160} {...props}>
      <ExternalLink size={14} position="relative" right={4} /> {text}
      <RightArrow size={14} position="relative" left={4} />
    </ConnectButtonWrapper>
  );
});

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

const WhiteButtonWrapper = styled(WhiteButton)`
  ${connectedButtonCommonStyles}
  line-height: 1.86;
`;

/* === EditButton === */

export const EditButton = ({ text = 'Edit', ...props }) => {
  return (
    <WhiteButtonWrapper {...props}>
      <Span mr={`0px`} mb={`3px`} mt={`2px`}>
        <PencilIcon height={15} />
      </Span>
      {text}
    </WhiteButtonWrapper>
  );
};

/* === DisconnectButton === */

export const DisconnectButton = ({ text = 'Disconnect', ...props }) => {
  return (
    <WhiteButtonWrapper {...props}>
      <XIcon />
      {text}
    </WhiteButtonWrapper>
  );
};

export const PencilIcon = props => <Pencil className={'icon'} {...props} />;
export const XIcon = props => <X className={'icon'} {...props} />;
