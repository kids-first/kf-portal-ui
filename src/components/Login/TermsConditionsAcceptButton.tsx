import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { CheckOutlined } from '@ant-design/icons';
import { Button, notification, Typography } from 'antd';

import ROUTES from 'common/routes';
import { TRACKING_EVENTS, trackUserInteraction } from 'services/analyticsTracking';
import { acceptTerms, subscribeUser } from 'store/actionCreators/user';
import { RootState } from 'store/rootState';
import { selectErrorSubscribeUser, selectIsLoadingUser, selectUser } from 'store/selectors/users';
import { DispatchUser, User } from 'store/userTypes';

import './termsConditions.css';

const { Paragraph } = Typography;

const NEVER_CLOSES_AUTOMATICALLY = 0;

type OwnProps = {
  isNewUser: boolean;
};

const mapState = (state: RootState) => ({
  errorSubscribeUser: selectErrorSubscribeUser(state),
  user: selectUser(state),
  isLoadingUser: selectIsLoadingUser(state),
});

const mapDispatch = (dispatch: DispatchUser) => ({
  onSubscribeUser: () => dispatch(subscribeUser()),
  acceptTerms: (user: User, cb: () => Promise<void>) => dispatch(acceptTerms(user, cb)),
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = OwnProps & PropsFromRedux;

const TermsConditionsAcceptButton = ({ isNewUser, onSubscribeUser, user, acceptTerms }: Props) => {
  const history = useHistory();
  const [updating, setUpdating] = useState(false);

  const onFinish = async () => {
    if (!isNewUser) {
      setUpdating(false);
      history.push(ROUTES.dashboard);
      return;
    }

    onSubscribeUser();

    notification.info({
      message: 'Success',
      description: (
        <Paragraph>
          Fill out your profile, or skip and <a href={'/search/file'}>browse data</a>
        </Paragraph>
      ),
      duration: NEVER_CLOSES_AUTOMATICALLY,
      key: 'terms-conditions-info-notification',
    });

    await trackUserInteraction({
      value: undefined,
      category: TRACKING_EVENTS.categories.join,
      action: TRACKING_EVENTS.actions.signedUp,
      label: `Join Completion: egoId ${user!._id}`,
    });
    setUpdating(false);
    history.push(`${ROUTES.user}/${user!._id}`);
  };

  const onClick = async () => {
    if (user && user.acceptedTerms) {
      // Page on unprotected route.
      // case: someone is logged in + already accepted terms
      // he/she wanted to decline terms but changed his/her mind.
      // Then, no need to update anything.
      history.push(ROUTES.dashboard);
      return;
    }
    setUpdating(true);

    acceptTerms(user!, onFinish);
  };

  return (
    <Button
      type={'primary'}
      className={'accept-btn'}
      icon={<CheckOutlined />}
      loading={updating}
      disabled={!user}
      onClick={onClick}
    >
      Accept
    </Button>
  );
};

export default connector(TermsConditionsAcceptButton);
