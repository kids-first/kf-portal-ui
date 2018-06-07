import React from 'react';
import { capitalize } from 'lodash';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import GIcon from 'react-icons/lib/fa/google';
import FBIcon from 'react-icons/lib/fa/facebook';
import Check from 'react-icons/lib/fa/check';

import { Box } from 'uikit/Core';
import { BigWhiteButton } from 'uikit/Button';

import { GOOGLE, FACEBOOK } from 'common/constants';

const GoogleIcon = styled(GIcon)`
  margin-left: 3px;
`;

const icons = {
  [GOOGLE]: x => <GoogleIcon color="#d62d20" {...x} />,
  [FACEBOOK]: x => <FBIcon color="#428bca" {...x} />,
};

const ButtonItem = styled(x => <Box p={3} {...x} />)`
  border-right: ${({ divider, theme }) => (divider ? `1px solid ${theme.greyScale8}` : `none`)};
  color: ${({ theme }) => theme.tertiary};
  white-space: nowrap;
  font-weight: 500;
  font-size: 16px;
`;

const ConnectedWithBadge = withTheme(({ theme, provider, Icon = icons[provider] }) => (
  <BigWhiteButton>
    <ButtonItem divider>
      <Check color={theme.active} />
      <Icon size={20} />
    </ButtonItem>
    <ButtonItem>Connected with {capitalize(provider)}</ButtonItem>
  </BigWhiteButton>
));

export default ConnectedWithBadge;
