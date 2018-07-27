import * as React from 'react';
import { compose, withState } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';

import Button, { HollowButton, ActionButton } from 'uikit/Button';
import ExternalLink from 'uikit/ExternalLink';
import RightIcon from 'react-icons/lib/fa/angle-right';
import CheckIcon from 'react-icons/lib/fa/check-circle';
import Spinner from 'react-spinkit';

import { cavaticaWebRoot, gen3WebRoot } from 'common/injectGlobals';
import { deleteSecret } from 'services/secrets';
import { deleteGen3Token } from 'services/gen3';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import Component from 'react-component-component';
import { Span, Paragraph, Div } from 'uikit/Core';
import Column from 'uikit/Column';
import Row from 'uikit/Row';

import CavaticaConnectModal from 'components/cavatica/CavaticaConnectModal';
import Gen3ConnectionDetails from 'components/UserProfile/Gen3ConnectionDetails';
import LoadingOnClick from 'components/LoadingOnClick';
import { connectGen3, getAccessToken } from 'services/gen3';
import { withApi } from 'services/api';

import gen3Logo from 'assets/logo-gen3-data-commons.svg';
import cavaticaLogo from 'assets/logo-cavatica.svg';
import { CAVATICA, GEN3 } from 'common/constants';
import { UserIntegrationsWrapper, IntegrationTable, PencilIcon, XIcon } from './ui';
import StackIcon from 'icons/StackIcon';
import styled from 'react-emotion';

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

const ConnectedButton = withTheme(({ onClick, theme, action, type, chilren, ...props }) => (
  <HollowButton
    {...props}
    onClick={() => {
      trackUserInteraction({
        category: TRACKING_EVENTS.categories.user.profile,
        action: `${action} Integration clicked`,
        label: type,
      });
      onClick();
    }}
  >
    {props.children}
  </HollowButton>
));

const Gen3DetailButton = styled(ConnectedButton)`
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.white};
  &:hover {
    background: ${({ theme }) => theme.primaryHover};
  }
  margin-bottom: 10px;
  min-width: 190px;
`;

const enhance = compose(
  injectState,
  withTheme,
  withState('editingCavatica', 'setEditingCavatica', false),
);

const gen3Status = ({ theme, onView, onRemove }) => {
  return (
    <Column>
      <Div color={theme.active} p={10}>
        <CheckIcon size={20} />
        <Span>Connected</Span>
      </Div>
      <Column>
        <Gen3DetailButton action="view" type="Gen3" onClick={onView}>
          <Span mr={`5px`}>
            <StackIcon fill={theme.white} height={15} />
          </Span>
          authorized studies
        </Gen3DetailButton>
        <LoadingOnClick
          onClick={onRemove}
          render={({ onClick, loading }) => (
            <ConnectedButton action="remove" type="Gen3" onClick={onClick}>
              {loading ? <LoadingSpinner /> : <XIcon />}
              <Span>Disconnect</Span>
            </ConnectedButton>
          )}
        />
      </Column>
    </Column>
  );
};

const cavaticaStatus = ({ theme, onEdit, onRemove }) => {
  return (
    <Column>
      <Div color={theme.active} p={10}>
        <CheckIcon size={20} />
        <Span> Connected</Span>
      </Div>
      <Row>
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
      </Row>
    </Column>
  );
};

export const isValidKey = key => {
  return key && key.length > 0;
};

const UserIntegrations = withApi(
  ({
    state: { integrationTokens, loggedInUser },
    effects,
    theme,
    api,
    onConnectSuccess = ({ service }) => {},
    onConnectFailure = ({ service, error }) => {},
    ...props
  }) => {
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
                        <ActionButton
                          onClick={() => {
                            setState({ loading: true });
                            connectGen3(api)
                              .then(() => getAccessToken(api))
                              .then(token => {
                                effects.setIntegrationToken(GEN3, token);
                                setState({ loading: false });
                                onConnectSuccess({ service: GEN3 });
                                effects.setToast({
                                  id: `${Date.now()}`,
                                  action: 'success',
                                  component: (
                                    <div
                                      css={`
                                        display: flex;
                                      `}
                                    >
                                      yo!
                                    </div>
                                  ),
                                });
                              })
                              .catch(err => {
                                console.log('err: ', err);
                                setState({ loading: false });
                                onConnectFailure({ service: GEN3, error: err });
                              });
                          }}
                        >
                          Connect
                          <RightIcon />
                        </ActionButton>
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
                    <ActionButton
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
                      Connect<RightIcon />
                    </ActionButton>
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
