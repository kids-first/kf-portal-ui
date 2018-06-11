import * as React from 'react';
import { css } from 'react-emotion';
import { compose, withState } from 'recompose';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';

import { Container } from './styles';
import Account from './Account';
import Privacy from './Privacy';

export default compose(withTheme, withState('mode', 'setMode', 'account'))(
  ({ profile, theme, submit, mode, setMode }) => (
    <div
      className={css`
        display: flex;
        justify-content: center;
        padding: 50px 0;
      `}
    >
      <Container
        className={css`
          ${theme.row} align-items: flex-start;
        `}
      >
        <div
          css={`
            border-radius: 5px;
            background-color: #ffffff;
            box-shadow: 0 0 2.9px 0.1px #a0a0a3;
            padding: 1em;
          `}
        >
          <ul css={theme.verticalNav}>
            <li>
              <a className={mode === 'account' ? 'active' : ''} onClick={() => setMode('account')}>
                <Trans>Settings</Trans>
              </a>
            </li>
          </ul>
        </div>
        {mode === 'account' && <Account profile={profile} submit={submit} />}
        {mode === 'privacy' && <Privacy profile={profile} submit={submit} />}
      </Container>
    </div>
  ),
);
