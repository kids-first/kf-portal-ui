import React from 'react';

import IntegrationTableItem from '../IntegrationTableItem';
import { Trans } from 'react-i18next';

import gen3Logo from 'assets/logo-gen3.svg';
import { cavaticaWebRoot, gen3WebRoot } from 'common/injectGlobals';

import ExternalLink from 'uikit/ExternalLink';
import ExternalLinkIcon from 'react-icons/lib/fa/external-link';
import RightIcon from 'react-icons/lib/fa/angle-right';
import CheckIcon from 'react-icons/lib/fa/check-circle';
import Spinner from 'react-spinkit';

import { deleteSecret } from 'services/secrets';
import { deleteGen3Token } from 'services/gen3';
import {
  trackUserInteraction,
  analyticsTrigger,
  TRACKING_EVENTS,
} from 'services/analyticsTracking';
import Component from 'react-component-component';
import { Span, Paragraph, Div } from 'uikit/Core';
import Column from 'uikit/Column';
import Row from 'uikit/Row';
import { TableHeader } from 'uikit/Table';

import CavaticaConnectModal from 'components/cavatica/CavaticaConnectModal';
import Gen3ConnectionDetails from 'components/UserProfile/Gen3ConnectionDetails';
import LoadingOnClick from 'components/LoadingOnClick';
import { connectGen3, getAccessToken } from 'services/gen3';
import { withApi } from 'services/api';
import { Gen3UserProvider } from 'services/gen3';

import cavaticaLogo from 'assets/logo-cavatica.svg';
import { CAVATICA, GEN3 } from 'common/constants';
import {
  ConnectButton,
  AuthorizedStudiesButton,
  DisconnectButton,
} from 'components/UserProfile/UserIntegrations/ui';
import StackIcon from 'icons/StackIcon';
import styled from 'react-emotion';
import { applyDefaultStyles } from 'uikit/Core';
import { WhiteButton, ActionButton } from 'uikit/Button';

const description = () => {
  return (
    <span>
      Access controlled data by connecting your account to{' '}
      <ExternalLink href={gen3WebRoot}>GEN3 Data Commons</ExternalLink> using your NIH login
      credentials.
    </span>
  );
};

const actionsOld = () => {
  return (
    <Component initialState={{ loading: false }}>
      {({ state: { loading }, setState }) => {
        return loading ? (
          <LoadingSpinner />
        ) : (
          <Gen3UserProvider
            render={({ gen3User, loading: loadingGen3User }) =>
              loadingGen3User ? (
                <LoadingSpinner />
              ) : gen3User ? (
                gen3Status({
                  theme,
                  onView: () =>
                    effects.setModal({
                      title: 'Your Authorized Studies',
                      component: (
                        <Gen3ConnectionDetails
                          onComplete={effects.unsetModal}
                          onCancel={effects.unsetModal}
                        />
                      ),
                    }),
                  onRemove: async () => {
                    setState({ loading: true });
                    await deleteGen3Token(api);
                    effects.setIntegrationToken(GEN3, null);
                    setState({ loading: false });
                  },
                })
              ) : (
                <ConnectButton
                  onClick={() => {
                    analyticsTrigger({
                      property: 'portal',
                      type: 'recording',
                      uiArea: TRACKING_EVENTS.categories.user.profile,
                      action: TRACKING_EVENTS.actions.integration.init,
                      label: TRACKING_EVENTS.labels.gen3,
                    });
                    setState({ loading: true });
                    connectGen3(api)
                      .then(() => getAccessToken(api))
                      .then(token => {
                        effects.setIntegrationToken(GEN3, token);
                        setState({ loading: false });
                        effects.setToast({
                          id: `${Date.now()}`,
                          action: 'success',
                          component: (
                            <Row>
                              <Trans>
                                Controlled dataset access sucessfully connected through Gen3
                              </Trans>
                            </Row>
                          ),
                        });
                        trackUserInteraction({
                          category: TRACKING_EVENTS.categories.user.profile,
                          action: TRACKING_EVENTS.actions.integration.connected,
                          label: TRACKING_EVENTS.labels.gen3,
                        });
                      })
                      .catch(err => {
                        console.log('err: ', err);
                        setState({ loading: false });
                        trackUserInteraction({
                          category: TRACKING_EVENTS.categories.user.profile,
                          action: TRACKING_EVENTS.actions.integration.failed,
                          label: TRACKING_EVENTS.labels.gen3,
                        });
                      });
                  }}
                />
              )
            }
          />
        );
      }}
    </Component>
  );
};

const actions = () => {
  return (
    <div>
      {false ? (
        <ConnectButton onClick={connect} />
      ) : (
        <Row>
          <AuthorizedStudiesButton />
          <DisconnectButton style={{ marginLeft: 10 }} />
        </Row>
      )}
    </div>
  );
};

const connect = () => {
  analyticsTrigger({
    property: 'portal',
    type: 'recording',
    uiArea: TRACKING_EVENTS.categories.user.profile,
    action: TRACKING_EVENTS.actions.integration.init,
    label: TRACKING_EVENTS.labels.gen3,
  });
  setState({ loading: true });
  connectGen3(api)
    .then(() => getAccessToken(api))
    .then(token => {
      effects.setIntegrationToken(GEN3, token);
      setState({ loading: false });
      effects.setToast({
        id: `${Date.now()}`,
        action: 'success',
        component: (
          <Row>
            <Trans>Controlled dataset access sucessfully connected through Gen3</Trans>
          </Row>
        ),
      });
      trackUserInteraction({
        category: TRACKING_EVENTS.categories.user.profile,
        action: TRACKING_EVENTS.actions.integration.connected,
        label: TRACKING_EVENTS.labels.gen3,
      });
    })
    .catch(err => {
      console.log('err: ', err);
      setState({ loading: false });
      trackUserInteraction({
        category: TRACKING_EVENTS.categories.user.profile,
        action: TRACKING_EVENTS.actions.integration.failed,
        label: TRACKING_EVENTS.labels.gen3,
      });
    });
};

const logo = () => {
  return <img src={gen3Logo} alt="Gen3 Logo" />;
};

export default ({ ...props }) => {
  return (
    <IntegrationTableItem
      logo={logo()}
      description={description()}
      actions={actions()}
      {...props}
    />
  );
};
