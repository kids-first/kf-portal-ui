import React from 'react';
import { capitalize } from 'lodash';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import GIcon from 'react-icons/lib/fa/google';
import FBIcon from 'react-icons/lib/fa/facebook';
import Check from 'react-icons/lib/fa/check';

import { Box, Span } from 'uikit/Core';

import { GOOGLE, FACEBOOK } from 'common/constants';

const GoogleIcon = styled(GIcon)`
  margin-left: 3px;
`;

const icons = {
  [GOOGLE]: x => <GoogleIcon color="#d62d20" {...x} />,
  [FACEBOOK]: x => <FBIcon color="#428bca" {...x} />,
};

const Status = styled(Span)`
  color: ${({ theme }) => theme.tertiary};
  padding: 2px;
  white-space: nowrap;
  font-weight: 500;
  font-size: 16px;
`;

const ConnectedWithBadge = withTheme(({ theme, provider, Icon = icons[provider] }) => (
  <Box>
    <Status>
      <Check color={theme.active} />
      <Icon size={20} />
    </Status>
    <Status>Connected with {capitalize(provider)}</Status>
  </Box>
));

export default ConnectedWithBadge;
