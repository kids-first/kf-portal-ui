import React, { Fragment } from 'react';
import { compose, withState } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';

import { DualPaneCard } from '../styles';
import AccessGate from '../../AccessGate';
import Cavatica from 'icons/Cavatica';
import CavaticaConnectModal from 'components/cavatica/CavaticaConnectModal';
import { CAVATICA } from 'common/constants';
import { analyticsTrigger, TRACKING_EVENTS } from 'services/analyticsTracking';
import { withApi } from 'services/api';
import Info from '../Info';
import { ConnectButton } from '../styles';
import Connected from './Connected';
import CardHeader from 'uikit/Card/CardHeader';
import Create from './Create';
import DualPaneHeader from 'uikit/Card/DualPaneCard/DualPaneHeader';
import CavaticaProvider from './CavaticaProvider';
import NotConnected from './NotConnected';

const isValidKey = key => {
  return key && key.length > 0;
};

const CavaticaProjects = compose(
  withApi,
  injectState,
  withTheme,
  withState('badgeNumber', 'setBadgeNumber', null),
  withState('stackIndex', 'setStackIndex', 0),
)(
  ({
    state: { integrationTokens },
    effects,
    badgeNumber,
    stackIndex,
    setStackIndex,
    setBadgeNumber,
  }) => {
    const setBadge = n => {
      if (n !== badgeNumber) setBadgeNumber(n);
    };

    const cardStack = [
      {
        title: 'Projects',
        component: (
          <CavaticaProvider setBadge={setBadge}>
            {({ projects, loading }) => <Connected projects={projects} loading={loading} />}
          </CavaticaProvider>
        ),
      },
      {
        title: 'Create',
        component: <Create setBadge={setBadge} setStackIndex={index => setStackIndex(index)} />,
      },
    ];

    const isConnected = isValidKey(integrationTokens[CAVATICA]);

    const Header = (
      <CardHeader title="Cavatica Projects" badge={badgeNumber}>
        {!isConnected &&
          cardStack.map((card, i) => (
            <DualPaneHeader
              key={i}
              active={i === stackIndex}
              onClick={() => setStackIndex(i)}
              title={card.title}
            />
          ))}
      </CardHeader>
    );

    const activeCard = cardStack[stackIndex];

    return (
      <DualPaneCard
        Header={Header}
        stackIndex={stackIndex}
        setStackIndex={index => setStackIndex(index)}
        inactive={!isConnected}
        scrollable={isConnected}
      >
        {isConnected ? activeCard.component : <NotConnected />}
      </DualPaneCard>
    );
  },
);

export default CavaticaProjects;
