import * as React from 'react';
import { compose, withState } from 'recompose';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';

import UserIntegrations from './UserIntegrations';

export const H2 = styled('h2')`
  font-family: Montserrat;
  font-size: 18px;
  font-weight: 300;
  font-style: normal;
  letter-spacing: 0.3px;
  color: #2b388f;
  width: 100%;
  margin-bottom: 20px;
  margin-top: 0px;
  border-bottom: 2px solid #d4d6dd;
`;

const SettingsSection = styled('section')`
  ${props => props.theme.column} justify-content: stretch;
  width: 100%;
  padding-bottom: 50px;
`;

export default compose(withTheme, withState('mode', 'setMode', 'account'))(
  ({ profile, theme, submit, mode, setMode }) => (
    <div
      css={`
        ${theme.column} width: 70%;
        padding: 0 2em;
      `}
    >
      <SettingsSection>
        <H2>Account Settings</H2>
        <div
          css={`
            ${theme.column};
            width: 70%;
          `}
        >
          Email Address:
          <input
            disabled
            value={profile.email}
            css={`
              ${theme.input};
              width: 100%;
            `}
          />
        </div>
      </SettingsSection>

      <SettingsSection>
        <H2>Integrations</H2>
        <UserIntegrations />
      </SettingsSection>
    </div>
  ),
);
