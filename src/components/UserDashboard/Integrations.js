import React from 'react';
import { Link } from 'react-router-dom';
import RightIcon from 'react-icons/lib/fa/angle-right';
import { CAVATICA, GEN3 } from 'common/constants';
import { gen3WebRoot, cavaticaWebRoot } from 'common/injectGlobals';
import downloadControlledAccess from 'assets/icon-download-controlled-data.svg';
import cavaticaLogo from 'assets/logomark-cavatica.svg';
import { IntegrationsDiv, IntegrationsCircleDiv, H4 } from './styles';
import IntegrationsStatus from './IntegrationsStatus';
import { H3 } from 'uikit/Headings';
import { Paragraph } from '../../uikit/Core';
import { LargeTealActionButton } from '../../uikit/Button';

const Integrations = ({ loggedInUser, theme, integrationTokens }) => (
  <div
    css={`
      border-radius: 30px;
      background-color: ${theme.backgroundGrey};
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
        <H3 mb="5px">Access Controlled Data</H3>
        <IntegrationsStatus
          connected={integrationTokens[GEN3]}
          theme={theme}
          name="Gen3"
          url={gen3WebRoot}
          unconnectedMsg={<Paragraph>Connect to Gen3 to download controlled data</Paragraph>}
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
        <H3 mb="5px">Analyze Data</H3>

        <IntegrationsStatus
          connected={integrationTokens[CAVATICA]}
          theme={theme}
          name="Cavatica"
          url={cavaticaWebRoot}
          unconnectedMsg={
            <Paragraph>
              Analyze data quickly by connecting your Kids First account to Cavatica
            </Paragraph>
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
        style={{ textDecoration: 'none' }}
      >
        <LargeTealActionButton>
          Settings <RightIcon size="18" />
        </LargeTealActionButton>
      </Link>
    </div>
  </div>
);

export default Integrations;
