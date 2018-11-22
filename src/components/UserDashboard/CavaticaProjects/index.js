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
import MultiCard from 'uikit/Multicard';

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
    const isConnected = isValidKey(integrationTokens[CAVATICA]);
    /*
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


       <CavaticaProvider setBadge={setBadgeNumber}>
              {({ projects, loading }) => <Connected projects={projects} loading={loading} />}
            </CavaticaProvider>
    );*/

    return (
      <MultiCard
        inactive={!isConnected}
        title="Cavatica Projects"
        tabMenu={['Projects', 'Create']}
        scrollable
      >
        {({ index, setTitle, setIndex, setBadge }) => {
          const cardContent = [
            <Create setBadge={setBadge} setIndex={setIndex} />,

            <div>
              <button onClick={() => setTitle('debaser')}>title</button>

              <button onClick={() => setIndex(0)}>go back</button>
            </div>,
          ];

          return isConnected ? cardContent[index] : <NotConnected />;
        }}
      </MultiCard>
    );
  },
);

export default CavaticaProjects;
