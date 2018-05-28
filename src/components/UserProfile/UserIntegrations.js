import * as React from 'react';
import { compose, withState } from 'recompose';
import { injectState } from 'freactal';
import { css } from 'emotion';
import { withTheme } from 'emotion-theming';
import styled from 'react-emotion';

import Button from 'uikit/Button';
import ExternalLink from 'uikit/ExternalLink';
import RightIcon from 'react-icons/lib/fa/angle-right';
import PencilIcon from 'react-icons/lib/fa/pencil';
import ViewIcon from 'react-icons/lib/fa/eye';
import XIcon from 'react-icons/lib/fa/close';
import CheckIcon from 'react-icons/lib/fa/check-circle';
import Spinner from 'react-spinkit';

import { cavaticaWebRoot, gen3WebRoot } from 'common/injectGlobals';
import { deleteSecret } from 'services/secrets';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

import CavaticaConnectModal from 'components/cavatica/CavaticaConnectModal';
import Gen3Connection from 'components/UserProfile/Gen3Connection';
import Gen3ConnectionDetails from 'components/UserProfile/Gen3ConnectionDetails';
import LoadingOnClick from 'components/LoadingOnClick';

import gen3Logo from 'assets/logo-gen3-data-commons.svg';
import cavaticaLogo from 'assets/logo-cavatica.svg';
import { CAVATICA, GEN3 } from 'common/constants';

const loadingSpinner = (
  <Spinner
    fadeIn="none"
    name="circle"
    color="black"
    style={{
      width: 11,
      height: 11,
    }}
  />
);

const Paragraph = styled('p')`
  line-height: 28px;
`;

const ConnectedButton = ({ onClick, action, type, chilren, ...props }) => (
  <Button
    {...props}
    onClick={() => {
      trackUserInteraction({
        category: TRACKING_EVENTS.categories.user.profile,
        action: `${action} Integration clicked`,
        label: type,
      });
      onClick();
    }}
    className="connectedButton"
  >
    {props.children}
  </Button>
);

const styles = theme => css`
  table {
    border-collapse: collapse;
  }
  td,
  th {
    padding: 10px;
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
  }
  div.integrationCell button {
    text-transform: uppercase;
    flex: 1;
  }
  .right {
    text-align: right;
  }
  .connectedButton {
    ${theme.hollowButton};
  }
`;

const enhance = compose(
  injectState,
  withTheme,
  withState('editingCavatica', 'setEditingCavatica', false),
);

const gen3Status = ({ theme, gen3Key, onView, onEdit, onRemove }) => {
  return (
    <div css="flex-direction: column;">
      <div
        css={`
          color: ${theme.active};
          padding: 10px;
        `}
      >
        <CheckIcon size={20} />
        <span>Connected</span>
      </div>
      <div css="display: flex;">
        <ConnectedButton action="view" type="Gen3" onClick={onView}>
          <ViewIcon className={`icon`} />View
        </ConnectedButton>
        <ConnectedButton action="edit" type="Gen3" onClick={onEdit}>
          <PencilIcon className={`icon`} />Edit
        </ConnectedButton>
        <ConnectedButton action="remove" type="Gen3" onClick={onRemove}>
          <XIcon className={`icon`} />Remove
        </ConnectedButton>
      </div>
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
        <ConnectedButton action="edit" type="Cavatica" onClick={onEdit}>
          <PencilIcon />Edit
        </ConnectedButton>

        <LoadingOnClick
          onClick={onRemove}
          render={({ onClick, loading }) => (
            <ConnectedButton action="remove" type="Cavatica" onClick={onClick}>
              {loading ? loadingSpinner : <XIcon />}
              <span>Remove</span>
            </ConnectedButton>
          )}
        />
      </div>
    </div>
  );
};

const UserIntegrations = ({ state: { integrationTokens }, effects, theme, ...props }) => {
  return (
    <div css={styles(theme)}>
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
              <Paragraph>
                Access controlled data by connecting your NIH Login and dbGaP authorized access to
                the Kids First Data Catalog powered by{' '}
                <ExternalLink href={gen3WebRoot}>Gen3</ExternalLink>.
              </Paragraph>
            </td>
            <td>
              <div className="integrationCell">
                {integrationTokens[GEN3] ? (
                  gen3Status({
                    theme,
                    gen3Key: integrationTokens[GEN3],
                    onView: () =>
                      effects.setModal({
                        title: 'Gen3 Connection Details',
                        component: (
                          <Gen3ConnectionDetails
                            onComplete={effects.unsetModal}
                            onCancel={effects.unsetModal}
                          />
                        ),
                      }),
                    onEdit: () =>
                      effects.setModal({
                        title: 'Edit Connection Details',
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
                  <button
                    css={theme.actionButton}
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
                  >
                    <span>Connect</span>
                    <RightIcon />
                  </button>
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
              <Paragraph>
                Analyze data quickly by connecting your Kids First account to{' '}
                <ExternalLink href={cavaticaWebRoot}>Cavatica</ExternalLink>.
              </Paragraph>
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
                          <CavaticaConnectModal
                            onComplete={effects.unsetModal}
                            onCancel={effects.unsetModal}
                          />
                        ),
                      }),
                    onRemove: async () => {
                      await deleteSecret({ service: CAVATICA });
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
                          <CavaticaConnectModal
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
