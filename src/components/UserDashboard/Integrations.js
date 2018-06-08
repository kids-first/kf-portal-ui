import React from 'react';
import { Link } from 'react-router-dom';
import RightIcon from 'react-icons/lib/fa/angle-right';
import { CAVATICA, GEN3 } from 'common/constants';
import { gen3WebRoot, cavaticaWebRoot } from 'common/injectGlobals';
import downloadControlledAccess from 'assets/icon-download-controlled-data.svg';
import cavaticaLogo from 'assets/logomark-cavatica.svg';
import ExternalLink from 'uikit/ExternalLink';
import { IntegrationsDiv, IntegrationsCircleDiv } from './styles';
import { H3, P } from '../../uikit/Typography';
import IntegrationsStatus from './IntegrationsStatus';

const IntegrationHeader = ({ children }) => (
  <H3 fontWeight="thin" color="primaryHover" my="0">
    {children}
  </H3>
);

const Integrations = ({ loggedInUser, theme, integrationTokens }) => (
  <div
    css={`
      border-radius: 30px;
      background-color: ${theme.colors.backgroundGrey};
      border: solid 1px ${theme.colors.greyScale5};
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
          max-width: 100%;
        `}
      >
        <IntegrationHeader>Download Controlled Data</IntegrationHeader>

        <IntegrationsStatus
          connected={integrationTokens[GEN3]}
          theme={theme}
          name="Gen3"
          url={gen3WebRoot}
          unconnectedMsg={
            <P
              my="0"
              css={`
                max-width: 75%;
              `}
            >
              Connect to{' '}
              <ExternalLink href={gen3WebRoot} hasExternalIcon={false}>
                Gen3
              </ExternalLink>{' '}
              to download controlled data
            </P>
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
          max-width: 305px;
        `}
      >
        <IntegrationHeader>Analyze Data</IntegrationHeader>

        <IntegrationsStatus
          connected={integrationTokens[CAVATICA]}
          theme={theme}
          name="Cavatica"
          url={cavaticaWebRoot}
          unconnectedMsg={
            <P
              my="0"
              css={`
                max-width: 75%;
              `}
            >
              Analyze data quickly by connecting your Kids First account to{' '}
              <ExternalLink href={cavaticaWebRoot} hasExternalIcon={false}>
                Cavatica
              </ExternalLink>.
            </P>
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
