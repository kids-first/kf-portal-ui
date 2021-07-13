/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button } from 'antd';
// @ts-ignore
import { injectState } from 'freactal';
// @ts-ignore
import { compose } from 'recompose';

import { withApi } from 'services/api';
import { Api } from 'store/apiTypes';
import { InjectStateProps } from 'store/freactalStateTypes';

import { uiLogout } from '../LogoutButton';
import SplashPage from '../SplashPage';

import TermsConditionsAcceptButton from './TermsConditionsAcceptButton';
import TermsConditionsBody from './TermsConditionsBody';

import './termsConditions.css';

type Props = InjectStateProps & Api & RouteComponentProps;

const TermsConditions: FunctionComponent<Props> = ({
  effects: { setToken, setUser, clearIntegrationTokens },
  state: { loggedInUser },
  api,
  history,
}) => (
  <SplashPage
    title={'Terms & Conditions'}
    extra={'Last Update Date: 7/22/20'}
    mainTitle={'Terms & Conditions'}
    content={<TermsConditionsBody />}
    footerContent={
      <div className={'action-buttons-wrapper'}>
        <Button
          key={'decline'}
          onClick={() =>
            //FIXME redux
            uiLogout({ loggedInUser, setUser, setToken, clearIntegrationTokens, api, history })
          }
        >
          Decline
        </Button>
        <TermsConditionsAcceptButton key={'accept'} type={'primary'} isNewUser={false} />
      </div>
    }
  />
);

export default compose(injectState, withRouter, withApi)(TermsConditions);
