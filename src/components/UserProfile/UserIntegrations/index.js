import * as React from 'react';
import { compose, withState } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';

import Button from 'uikit/Button';
import ExternalLink from 'uikit/ExternalLink';
import RightIcon from 'react-icons/lib/fa/angle-right';
import CheckIcon from 'react-icons/lib/fa/check-circle';
import Spinner from 'react-spinkit';

import { cavaticaWebRoot, gen3WebRoot } from 'common/injectGlobals';
import { deleteSecret } from 'services/secrets';
import { deleteGen3Token } from 'services/gen3';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import Component from 'react-component-component';
import { Span, Paragraph } from 'uikit/Core';

import CavaticaConnectModal from 'components/cavatica/CavaticaConnectModal';
import Gen3ConnectionDetails from 'components/UserProfile/Gen3ConnectionDetails';
import LoadingOnClick from 'components/LoadingOnClick';
import { connectGen3, getAccessToken } from 'services/gen3';
import { withApi } from 'services/api';

import gen3Logo from 'assets/logo-gen3-data-commons.svg';
import cavaticaLogo from 'assets/logo-cavatica.svg';
import { CAVATICA, GEN3 } from 'common/constants';
import { UserIntegrationsWrapper, IntegrationTable, PencilIcon, ViewIcon, XIcon } from './ui';

export const LoadingSpinner = ({ width = 11, height = 11 }) => (
  <Spinner
    fadeIn="none"
    name="circle"
    color="black"
    style={{
      width,
      height,
    }}
  />
);

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
        <Span>Connected</Span>
      </div>
      <div css="display: flex;">
        <ConnectedButton action="view" type="Gen3" onClick={onView}>
          <ViewIcon />View
        </ConnectedButton>
        <LoadingOnClick
          onClick={onRemove}
          render={({ onClick, loading }) => (
            <ConnectedButton action="remove" type="Gen3" onClick={onClick}>
              {loading ? <LoadingSpinner /> : <XIcon />}
              <Span>Disconnect</Span>
            </ConnectedButton>
          )}
        />
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
        <Span> Connected</Span>
      </div>
      <div css="display: flex;">
        <ConnectedButton action="edit" type="Cavatica" onClick={onEdit}>
          <PencilIcon />Edit
        </ConnectedButton>
        <LoadingOnClick
          onClick={onRemove}
          render={({ onClick, loading }) => (
            <ConnectedButton action="remove" type="Cavatica" onClick={onClick}>
              {loading ? <LoadingSpinner /> : <XIcon />}
              <Span>Disconnect</Span>
            </ConnectedButton>
          )}
        />
      </div>
    </div>
  );
};

export const isValidKey = key => {
  return key && key.length > 0;
};

const UserIntegrations = withApi(
  ({ state: { integrationTokens, loggedInUser }, effects, theme, api, ...props }) => {
    return (
      <UserIntegrationsWrapper>
        <IntegrationTable>
          <thead>
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
                <Span className="integrationHeader">Download Controlled Data</Span>
                <Paragraph>
                  Access controlled data by connecting your NIH Login and dbGaP authorized access to
                  the Kids First Data Catalog powered by{' '}
                  <ExternalLink href={gen3WebRoot}>Gen3</ExternalLink>.
                </Paragraph>
              </td>
              <td>
                <div className="integrationCell">
                  <Component initialState={{ loading: false }}>
                    {({ state: { loading }, setState }) => {
                      return loading ? (
                        <LoadingSpinner />
                      ) : isValidKey(integrationTokens[GEN3]) ? (
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
                          onRemove: async () => {
                            await deleteGen3Token(api);
                            effects.setIntegrationToken(GEN3, null);
                          },
                        })
                      ) : (
                        <button
                          css={theme.actionButton}
                          onClick={() => {
                            setState({ loading: true });
                            connectGen3(api)
                              .then(() => getAccessToken(api))
                              .then(token => {
                                effects.setIntegrationToken(GEN3, token);
                                setState({ loading: false });
                              })
                              .catch(err => {
                                console.log('err: ', err);
                                setState({ loading: false });
                              });
                          }}
                        >
                          <Span>Connect</Span>
                          <RightIcon />
                        </button>
                      );
                    }}
                  </Component>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <img className="logoImg" src={cavaticaLogo} alt="Cavatica Logo" />
              </td>
              <td>
                <Span className="integrationHeader">Analyze Data</Span>
                <Paragraph>
                  Analyze data quickly by connecting your Kids First account to{' '}
                  <ExternalLink href={cavaticaWebRoot}>Cavatica</ExternalLink>.
                </Paragraph>
              </td>
              <td>
                <div className="integrationCell">
                  {isValidKey(integrationTokens[CAVATICA]) ? (
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
                      <Span>
                        Connect<RightIcon />
                      </Span>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </IntegrationTable>
      </UserIntegrationsWrapper>
    );
  },
);

export default enhance(UserIntegrations);
