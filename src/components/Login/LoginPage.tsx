/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import Login from 'components/Login/Login';
import SplashPage from 'components/SplashPage';
import { RightOutlined } from '@ant-design/icons';

import './index.css';
import ButtonWithRouter from 'ui/Buttons/ButtonWithRouter';
import { LoggedInUser } from 'store/userTypes';
import ROUTES from 'common/routes';
import { hasUserRole } from 'utils';

type OwnProps = {
  stealth: boolean;
};

type Props = OwnProps & RouteComponentProps;

const LoginPage: FunctionComponent<Props> = ({ history, stealth = false }) => (
  <SplashPage
    stealth={stealth}
    title={stealth ? null : 'Log in'}
    mainTitle={'Kids First Data Resource Portal'}
    content={
      <Login
        shouldNotRedirect={true}
        onFinish={(user: LoggedInUser) => {
          const showJoin = !hasUserRole(user);
          if (showJoin) {
            history.push(ROUTES.join);
          } else {
            history.push(ROUTES.termsConditions);
          }
        }}
      />
    }
    footerContent={
      stealth ? null : (
        <div className={'text-align-center'}>
          {'New to Kids First Data Resource Portal? '}
          <ButtonWithRouter type={'link'} getLink={async () => ROUTES.join}>
            Join now
            <RightOutlined />
          </ButtonWithRouter>
        </div>
      )
    }
  />
);

export default withRouter(LoginPage);
