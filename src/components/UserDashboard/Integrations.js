import React from 'react';
import { Link } from 'react-router-dom';
import RightIcon from 'react-icons/lib/fa/angle-right';
import { CAVATICA, GEN3 } from 'common/constants';
import { gen3WebRoot, cavaticaWebRoot } from 'common/injectGlobals';
import downloadControlledAccess from 'assets/icon-download-controlled-data.svg';
import cavaticaLogo from 'assets/logomark-cavatica.svg';
import ExternalLink from 'uikit/ExternalLink';
import { IntegrationsDiv, IntegrationsCircleDiv, StyledH4 } from './styles';
import IntegrationsStatus from './IntegrationsStatus';

const Integrations = ({ loggedInUser, theme, integrationTokens }) => (
  <div
    css={`
      border-radius: 30px;
      background-color: #f4f5f8;
      border: solid 1px ${theme.greyScale5};
      padding: 10px 10px;
      ${theme.row};
      align-items: center;
      justify-content: space-around;
    `}
  >
    <IntegrationsDiv>
      <IntegrationsCircleDiv>
        <img
          css={`
            width: 42px;
          `}
          src={downloadControlledAccess}
          alt="Download controlled access icon"
        />
      </IntegrationsCircleDiv>
      <div
        css={`
          ${theme.column};
          padding: 10px;
          max-width: 260px;
        `}
      >
        <StyledH4>Download Controlled Data</StyledH4>
        <IntegrationsStatus
          connected={integrationTokens[GEN3]}
          theme={theme}
          name="Gen3"
          url={gen3WebRoot}
          unconnectedMsg={
            <div>
              Connect to{' '}
              <ExternalLink
                href={gen3WebRoot}
                hasExternalIcon={false}
                css={`
                  color: #a42c90;
                `}
              >
                Gen3
              </ExternalLink>{' '}
              to download controlled data
            </div>
          }
        />
      </div>
    </IntegrationsDiv>

    <IntegrationsDiv>
      <IntegrationsCircleDiv>
        <img
          css={`
            width: 42px;
          `}
          src={cavaticaLogo}
          alt="Cavatica Logo"
        />
      </IntegrationsCircleDiv>
      <div
        css={`
          ${theme.cloumn};
          padding: 10px;
          max-width: 260px;
        `}
      >
        <StyledH4>Analyze Data</StyledH4>

        <IntegrationsStatus
          connected={integrationTokens[CAVATICA]}
          theme={theme}
          name="Cavatica"
          url={cavaticaWebRoot}
          unconnectedMsg={
            <div>
              Analyze data quickly by connecting your Kids First account to{' '}
              <ExternalLink
                href={cavaticaWebRoot}
                hasExternalIcon={false}
                css={`
                  color: #a42c90;
                `}
              >
                Cavatica
              </ExternalLink>.
            </div>
          }
        />
      </div>
    </IntegrationsDiv>
    <div>
      <Link
        to={{
          pathname: `/user/${loggedInUser.egoId}`,
          hash: '#settings',
        }}
        css={theme.actionButton}
      >
        Settings <RightIcon />
      </Link>
    </div>
  </div>
);

export default Integrations;
