import * as React from 'react';
import { compose, withState } from 'recompose';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';

import { Container, NavContainer, NavList, NavItem } from './ui';
import Account from './Account';
import Privacy from './Privacy';
import { Flex } from 'uikit/Core';

export default compose(
  withTheme,
  withState('mode', 'setMode', 'account'),
)(({ profile, theme, submit, mode, setMode }) => (
  <Flex justifyContent="center" pt={4} pb={4}>
    <Container row alignItems="flex-start">
      {/*
           * Will be added once privacy page is available
           * 
           
          <NavContainer>
            <NavList>
              <NavItem active={mode === 'account'} onClick={() => setMode('account')}>
                <Trans>Settings</Trans>
              </NavItem>
            </NavList>
          </NavContainer>
          */}
      {mode === 'account' && <Account profile={profile} submit={submit} />}
      {mode === 'privacy' && <Privacy profile={profile} submit={submit} />}
    </Container>
  </Flex>
));
