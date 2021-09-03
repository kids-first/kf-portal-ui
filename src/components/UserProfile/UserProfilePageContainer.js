import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import { Layout, Spin } from 'antd';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import Error from 'components/Error';
import { KEY_ABOUT_ME } from 'components/UserProfile/constants';
import UserProfilePage from 'components/UserProfile/UserProfilePage';
import {
  addStateInfo as updateTrackingInfo,
  TRACKING_EVENTS,
  trackProfileInteraction,
  trackUserInteraction,
} from 'services/analyticsTracking';
import { withApi } from 'services/api';
import {
  cleanProfileErrors,
  deleteProfile,
  fetchProfileIfNeeded,
  updateUserProfile,
} from 'store/actionCreators/profile';
import {
  selectErrorProfile,
  selectIsProfileLoading,
  selectIsProfileUpdating,
  selectProfile,
} from 'store/selectors/profile';
import { selectIsUserAdmin, selectUser } from 'store/selectors/users';
import { isSelfInUrlWhenLoggedIn } from 'utils';

import './style.css';

class UserProfilePageContainer extends React.Component {
  static propTypes = {
    profile: PropTypes.shape({
      /** There are other fields, as well. */
      hashedEmail: PropTypes.string,
      roles: PropTypes.arrayOf(PropTypes.string),
      isPublic: PropTypes.bool,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      email: PropTypes.string,
    }),
    user: PropTypes.object.isRequired,
    onFetchProfile: PropTypes.func.isRequired,
    onUpdateProfile: PropTypes.func.isRequired,
    api: PropTypes.func,
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.object,

    onDeleteProfile: PropTypes.func.isRequired,
    location: PropTypes.shape({
      hash: PropTypes.string.isRequired,
    }).isRequired,
    isProfileUpdating: PropTypes.bool.isRequired,
    onCleanErrors: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool,
    userIdFromUrl: PropTypes.string.isRequired,
  };

  static defaultProps = {
    isAdmin: false,
  };

  state = {
    currentMenuItem: this.props.location.hash || KEY_ABOUT_ME,
    collapsed: false,
  };

  componentDidMount() {
    const { onFetchProfile, userIdFromUrl, user } = this.props;
    onFetchProfile({
      userID: userIdFromUrl,
      isSelf: isSelfInUrlWhenLoggedIn(userIdFromUrl, user),
    });
  }

  componentDidUpdate(prevProps) {
    const {
      onFetchProfile,
      location: { hash },
      userIdFromUrl,
      user,
    } = this.props;
    if (prevProps.userIdFromUrl !== userIdFromUrl) {
      onFetchProfile({
        userID: userIdFromUrl,
        isSelf: isSelfInUrlWhenLoggedIn(userIdFromUrl, user),
      });
    }

    const hasHashChanged = prevProps.location.hash !== hash;
    if (hasHashChanged) {
      this.setState({ currentMenuItem: hash });
    }
  }

  componentWillUnmount() {
    const { onDeleteProfile, onCleanErrors } = this.props;
    onCleanErrors();
    onDeleteProfile();
  }

  submit = async (values) => {
    const { profile, onUpdateProfile, api } = this.props;

    const mergedProfile = {
      ...profile,
      ...values,
    };
    const roles = mergedProfile.roles;

    const isRoleChanged = Object.prototype.hasOwnProperty.call(values, 'roles');
    if (isRoleChanged) {
      await trackUserInteraction({
        category: TRACKING_EVENTS.categories.user.profile,
        action: `${TRACKING_EVENTS.actions.userRoleSelected} to`,
        label: roles[0],
      });
      updateTrackingInfo({ userRoles: roles });
    }

    await trackProfileInteraction({
      action: 'Profile',
      value: false,
      type: TRACKING_EVENTS.actions.save,
    });

    onUpdateProfile(api, mergedProfile);
  };

  handleMenuClick = (e) => {
    this.setState({
      currentMenuItem: e.key,
    });
  };

  onBreakPoint = (broken) => this.setState({ collapsed: broken });

  render() {
    const {
      isLoading,
      error,
      profile,
      user,
      userIdFromUrl,
      location: { hash },
      isProfileUpdating,
      isAdmin,
    } = this.props;

    const { currentMenuItem, collapsed } = this.state;

    if (isLoading) {
      return (
        <Layout className={'up-is-loading-layout'}>
          <Spin indicator={<LoadingOutlined className={'up-spin'} spin />} />
        </Layout>
      );
    } else if (error) {
      return (
        <Layout className={'up-is-loading-layout'}>
          <Error />{' '}
        </Layout>
      );
    } else if (isEmpty(profile)) {
      return (
        <Layout className={'up-is-loading-layout'}>
          <Spin indicator={<LoadingOutlined className={'up-spin'} spin />} />
        </Layout>
      );
    }

    return (
      <UserProfilePage
        profile={profile}
        updateProfileCb={this.submit}
        canEdit={isSelfInUrlWhenLoggedIn(userIdFromUrl, user)}
        hash={hash}
        key={currentMenuItem} // Allows to create a new component instance when hash is changed.
        handleMenuClickCb={this.handleMenuClick}
        currentMenuItem={currentMenuItem}
        isProfileUpdating={isProfileUpdating}
        collapsed={collapsed}
        onBreakPointCb={this.onBreakPoint}
        isAdmin={isAdmin}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  profile: selectProfile(state),
  isLoading: selectIsProfileLoading(state),
  error: selectErrorProfile(state),
  isProfileUpdating: selectIsProfileUpdating(state),
  isAdmin: selectIsUserAdmin(state),
  user: selectUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  onFetchProfile: (userInfo) => dispatch(fetchProfileIfNeeded(userInfo)),
  onUpdateProfile: (api, user) => dispatch(updateUserProfile(api, user)),
  onDeleteProfile: () => dispatch(deleteProfile()),
  onCleanErrors: () => dispatch(cleanProfileErrors()),
});

export default compose(
  withRouter,
  withApi,
  connect(mapStateToProps, mapDispatchToProps),
)(UserProfilePageContainer);
