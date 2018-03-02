import * as React from 'react';
import { compose, withState } from 'recompose';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';


export const H2 = styled('h2')`
  font-family: Montserrat;
  font-size: 18px;
  font-weight: 300;
  font-style: normal;
  line-height: 0.06;
  letter-spacing: 0.3px;
  color: #2b388f;
  width: 200px;
`;

const SettingsSection = styled('section')`
  ${props => props.theme.row} justify-content: stretch;
  width: 100%;
  border-bottom: 2px solid #d4d6dd;
  padding: 30px 0;
`;

const Td = styled('td')`
  font-family: Montserrat;
  font-size: 14px;
  line-height: 1.43;
  border: solid 1px #e0e1e6;
  padding: 1em;
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
        <div
          css={`
            ${theme.column};
            width: 80%;
          `}
        >
          <table
            css={`
              border-collapse: collapse;
            `}
          >
            <thead
              css={`
                background-color: #edeef1;
                border: solid 1px #e0e1e6;
              `}
            >
              <tr>
                <Td>Service</Td>
                <Td>Purpose</Td>
                <Td>Integrate</Td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>Gen3 logo</Td>
                <Td>
                  <h3>Download Controlled Data</h3>
                  Access and download controlled data by connecting your Kids First account to Gen3.
                </Td>
                <Td>Connect</Td>
              </tr>
              <tr>
                <Td>Cavatica logo</Td>
                <Td>
                  <h3>Analyze Data</h3>
                  Analyze data quickly by connecting your Kids First account to <a>Cavatica</a>.
                </Td>
                <Td>Connect</Td>
              </tr>
            </tbody>
          </table>
        </div>
      </SettingsSection>
    </div>
  ),
);
