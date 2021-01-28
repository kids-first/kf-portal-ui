/* eslint-disable react/prop-types */
import React, { FunctionComponent, useState } from 'react';
// @ts-ignore
import { injectState } from 'freactal';
// @ts-ignore
import { compose } from 'recompose';
import { InjectStateProps } from 'store/freactalStateTypes';
import { Button, notification, Typography } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { RootState } from 'store/rootState';
import { subscribeLoggedInUser } from 'store/actionCreators/user';
import { connect, ConnectedProps } from 'react-redux';
import { LoggedInUser, DispatchUser } from 'store/userTypes';
import { selectErrorSubscribeUser } from 'store/selectors/users';
import { withApi } from 'services/api';
import { Api } from 'store/apiTypes';
import { CheckOutlined } from '@ant-design/icons';
import './termsConditions.css';
import { updateProfile } from 'services/profiles';
import ROUTES from 'common/routes';
import { setForumBannerForDisplay } from 'ForumBanner';

const { Paragraph } = Typography;

const NEVER_CLOSES_AUTOMATICALLY = 0;

type OwnProps = {
  isNewUser: boolean;
};

type UserSubState = {
  errorSubscribeUser: Error | null;
};

const mapState = (state: RootState): UserSubState => ({
  errorSubscribeUser: selectErrorSubscribeUser(state),
});

const mapDispatch = (dispatch: DispatchUser) => ({
  onSubscribeUser: (params: LoggedInUser) => dispatch(subscribeLoggedInUser(params)),
});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = OwnProps & InjectStateProps & ButtonProps & RouteComponentProps & PropsFromRedux & Api;

const TermsConditionsAcceptButton: FunctionComponent<Props> = ({
  isNewUser,
  disabled,
  history,
  state: { loggedInUser, isLoadingUser },
  effects: { setUser },
  onSubscribeUser,
  api,
  type,
}) => {
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  const onClick = async () => {
    setIsUpdatingUser(true);
    const { email, ...rest } = loggedInUser;
    // FIXME Legacy code
    const profile = await updateProfile(api)({
      user: {
        ...rest,
        email,
        acceptedTerms: true,
      },
    });

    const updatedUser = { ...profile, email };
    setIsUpdatingUser(false);
    if (isNewUser) {
      await onSubscribeUser(updatedUser);
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
        label: `Join Completion: egoId ${loggedInUser._id}`,
      });
      await setUser({ ...updatedUser, api, isJoining: false });
      setForumBannerForDisplay();
      history.push(`${ROUTES.user}/${loggedInUser._id}`);
    } else {
      await setUser({ ...updatedUser, api, isJoining: false });
      setForumBannerForDisplay();
      history.push(ROUTES.dashboard);
    }
  };

  return (
    <Button
      type={type}
      className={'accept-btn'}
      icon={<CheckOutlined />}
      loading={isUpdatingUser || isLoadingUser}
      disabled={disabled}
      onClick={onClick}
    >
      Accept
    </Button>
  );
};

export default compose(injectState, withApi, withRouter, connector)(TermsConditionsAcceptButton);
