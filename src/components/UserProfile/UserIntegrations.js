import * as React from 'react';
import { compose, withState } from 'recompose';
import { injectState } from 'freactal';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';

import Button from 'uikit/Button';
import ExternalLink from 'uikit/ExternalLink';
import RightIcon from 'react-icons/lib/fa/angle-right';
import PencilIcon from 'react-icons/lib/fa/pencil';
import XIcon from 'react-icons/lib/fa/close';
import CheckIcon from 'react-icons/lib/fa/check-circle';

import { deleteSecret } from 'services/secrets';
import CavaticaInput from 'components/UserProfile/CavaticaTokenInput';
import Gen3Connection from 'components/UserProfile/Gen3Connection';
import gen3Logo from 'assets/logo-gen3-data-commons.svg';
import cavaticaLogo from 'assets/logo-cavatica.svg';
import { CAVATICA, GEN3 } from 'common/constants';
import { getUser } from 'services/cavatica';

const styles = css`
  table {
    border-collapse: collapse;
  }
  td,
  th {
    padding: 12px;
    font-weight: normal;
  }
  td {
    background: white;
  }
  font-size: 14px;
  span {
    flex: 1;
  }
  button {
    flex: 1;
    font-weight: bold;
    padding: 6px;
    margin: 2px;
    padding-left: 5px;
    text-transform: uppercase;
  }

  .logoImg {
    width: 150px;
  }

  span.integrationHeader {
    font-weight: bold;
  }
  div.integrationCell {
    display: flex;
    width: 100%;
  }
  div.integrationCell button {
    text-transform: uppercase;
    flex: 1;
  }
  .right {
    text-align: right;
  }
  .connectedButton {
    color: black;
    background: none;
  }
`;

const enhance = compose(
  injectState,
  withTheme,
  withState('editingCavatica', 'setEditingCavatica', false),
);

const gen3Status = ({ gen3Key }) => {
  return (
    <div>
      <span>Connected: {gen3Key} </span>
    </div>
  );
};

const cavaticaStatus = ({ theme, cavaticaKey, onEdit, onRemove }) => {
  return (
    <div css="flex-direction: column;">
      <div
        css={`
          color: ${theme.active};
          padding: 10px;
        `}
      >
        <CheckIcon size={20} />
        <span> Connected</span>
      </div>
      <div css="display: flex;">
        <Button onClick={onEdit} className="connectedButton">
          <PencilIcon />Edit
        </Button>
        <Button onClick={onRemove} className="connectedButton">
          <XIcon />Remove
        </Button>
      </div>
    </div>
  );
};

const isCookieAvailable = (retryCounter) => {
  console.log(decodeURIComponent(document.cookie));
  let output = retryCounter > 50 ? true : false;
  return output;
};

const UserIntegrations = ({ state: { integrationTokens }, effects, theme, ...props }) => {
  return (
    <div css={styles}>
      <table
        css={`
          td,
          th {
            border: 1px solid ${theme.greyScale5};
          }
        `}
      >
        <thead
          css={`
            background: ${theme.greyScale6};
            color: ${theme.secondary};
            text-align: left;
          `}
        >
          <tr>
            <th>Service</th>
            <th>Purpose</th>
            <th>Integrate</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <img className="logoImg" src={gen3Logo} alt="Gen3 Logo" />
            </td>
            <td>
              <span className="integrationHeader">Download Controlled Data</span>
              <p>
                Access and download controlled data by connecting your Kids First account to{' '}
                <ExternalLink href="https://gen3.kids-first.io/">Gen3</ExternalLink>.
              </p>
            </td>
            <td>
              <div className="integrationCell">
                {integrationTokens[GEN3] ? (
                  gen3Status({
                    theme,
                    gen3Key: integrationTokens[GEN3],
                    onEdit: () =>
                      effects.setModal({
                        title: 'How to Connect to Gen3',
                        component: (
                          <Gen3Connection
                            onComplete={effects.unsetModal}
                            onCancel={effects.unsetModal}
                          />
                        ),
                      }),
                    onRemove: () => {
                      deleteSecret({ service: GEN3 });
                      effects.setIntegrationToken(GEN3, null);
                    },
                  })
                ) : (
                    <Button
                      onClick={() =>
                        effects.setModal({
                          title: 'How to Connect to Gen3',
                          component: (
                            <Gen3Connection
                              onComplete={effects.unsetModal}
                              onCancel={effects.unsetModal}
                            />
                          ),
                        })
                      }
                    ><span>Connect</span>
                      <RightIcon className="right" />
                    </Button>
                  )}
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <img className="logoImg" src={cavaticaLogo} alt="Cavatica Logo" />
            </td>
            <td>
              <span className="integrationHeader">Analyze Data</span>
              <p>
                Analyze data quickly by connecting your Kids First account to{' '}
                <ExternalLink href="http://cavatica.org/">Cavatica</ExternalLink>.
              </p>
            </td>
            <td>
              <div className="integrationCell">
                {integrationTokens[CAVATICA] ? (
                  cavaticaStatus({
                    theme,
                    cavaticaKey: integrationTokens[CAVATICA],
                    onEdit: () =>
                      effects.setModal({
                        title: 'How to Connect to Cavatica',
                        component: (
                          <CavaticaInput
                            onComplete={effects.unsetModal}
                            onCancel={effects.unsetModal}
                          />
                        ),
                      }),
                    onRemove: () => {
                      deleteSecret({ service: CAVATICA });
                      effects.setIntegrationToken(CAVATICA, null);
                    },
                  })
                ) : (
                  <button
                    css={theme.actionButton}
                    onClick={() =>
                      effects.setModal({
                        title: 'How to Connect to Cavatica',
                        component: (
                          <CavaticaInput
                            onComplete={effects.unsetModal}
                            onCancel={effects.unsetModal}
                          />
                        ),
                      })
                    }
                  >
                    <span>
                      Connect<RightIcon />
                    </span>
                  </button>
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default enhance(UserIntegrations);
