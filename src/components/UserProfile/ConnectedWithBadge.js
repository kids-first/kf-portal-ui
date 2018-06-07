import React from 'react';
import { capitalize } from 'lodash';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import GIcon from 'react-icons/lib/fa/google';
import FBIcon from 'react-icons/lib/fa/facebook';
import Check from 'react-icons/lib/fa/check';

import { Box, Flex } from 'uikit/Core';

import { GOOGLE, FACEBOOK } from 'common/constants';

const GoogleIcon = styled(GIcon)`
  margin-left: 3px;
`;

const icons = {
  [GOOGLE]: x => <GoogleIcon color="#d62d20" {...x} />,
  [FACEBOOK]: x => <FBIcon color="#428bca" {...x} />,
};

const ConnectedBadgeContainer = styled(Flex)`
  background: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.greyScale8};
  box-shadow: 0 0 2.9px 0.1px ${({ theme }) => theme.lightShadow};
  border-radius: 25px;
`;

const ConnectedSection = styled(x => <Box p={3} {...x} />)`
  border-right: ${({ divider, theme }) => (divider ? `1px solid ${theme.greyScale8}` : `none`)};
  color: ${({ theme }) => theme.tertiary};
  white-space: nowrap;
  font-weight: 500;
`;

const ConnectedWithBadge = withTheme(({ theme, provider, Icon = icons[provider] }) => (
  <ConnectedBadgeContainer>
    <ConnectedSection divider>
      <Check color={theme.active} />
      <Icon size={20} />
    </ConnectedSection>
    <ConnectedSection>Connected with {capitalize(provider)}</ConnectedSection>
  </ConnectedBadgeContainer>
));

export default ConnectedWithBadge;
