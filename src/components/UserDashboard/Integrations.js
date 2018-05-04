import React from 'react';
import { Link } from 'react-router-dom';
import RightIcon from 'react-icons/lib/fa/angle-right';
import { CAVATICA, GEN3 } from 'common/constants';
import downloadControlledAccess from 'assets/icon-download-controlled-data.svg';
import cavaticaLogo from 'assets/logomark-cavatica.svg';
import ExternalLink from 'uikit/ExternalLink';
import { IntegrationsDiv, IntegrationsCircleDiv, StyledH4 } from './styles';
import IntegrationsStatus from './IntegrationsStatus';

const Integrations = ({ loggedInUser, theme, integrationTokens }) => (
  <div className={`integrations ${theme.integrations({ theme })} ${theme.row}`}>
    <IntegrationsDiv>
      <IntegrationsCircleDiv>
        <img
          className={`iconImage`}
          src={downloadControlledAccess}
          alt="Download controlled access icon"
        />
      </IntegrationsCircleDiv>
      <div className={`${theme.column} description`}>
        <StyledH4>Download Controlled Data</StyledH4>
        <IntegrationsStatus
          connected={integrationTokens[GEN3]}
          theme={theme}
          name="Gen3"
          url="https://gen3.kids-first.io/"
          unconnectedMsg={
            <div>
              Connect to{' '}
              <ExternalLink href="https://gen3.kids-first.io/" hasExternalIcon={false}>
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
        <img className={`iconImage`} src={cavaticaLogo} alt="Cavatica Logo" />
      </IntegrationsCircleDiv>
      <div className={`${theme.column} description`}>
        <StyledH4>Analyze Data</StyledH4>
        <IntegrationsStatus
          connected={integrationTokens[CAVATICA]}
          theme={theme}
          name="Cavatica"
          url="http://cavatica.org/"
          unconnectedMsg={
            <div>
              Analyze data quickly by connecting your Kids First account to{' '}
              <ExternalLink href="http://cavatica.org/" hasExternalIcon={false}>
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
