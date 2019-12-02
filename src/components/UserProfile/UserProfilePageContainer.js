import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  selectProfile,
  selectIsProfileLoading,
  selectErrorProfile,
  selectIsProfileUpdating,
} from '../../store/selectors/users';
import {
  fetchProfileIfNeeded,
  updateUserProfile,
  deleteProfile,
} from '../../store/actionCreators/user';
import Error from '../Error';
import isEmpty from 'lodash/isEmpty';
import UserProfilePage from './UserProfilePage';
import { withRouter } from 'react-router-dom';
import { Icon, Layout, Spin } from 'antd';
import {
  addStateInfo as updateTrackingInfo,
  TRACKING_EVENTS,
  trackProfileInteraction,
  trackUserInteraction,
} from 'services/analyticsTracking';
import './style.css';

class UserProfilePageContainer extends React.Component {
  static propTypes = {
    profile: PropTypes.object,
    onFetchProfile: PropTypes.func.isRequired,
    onUpdateProfile: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.object,
    userID: PropTypes.string,
    userInfo: PropTypes.exact({
      userID: PropTypes.string,
      isSelf: PropTypes.bool,
    }).isRequired,
    onDeleteProfile: PropTypes.func.isRequired,
    location: PropTypes.shape({
      hash: PropTypes.string.isRequired,
    }).isRequired,
    isProfileUpdating: PropTypes.bool.isRequired,
  };

  state = {
    currentMenuItem: this.props.location.hash,
  };

  componentDidMount() {
    const { onFetchProfile, userInfo } = this.props;
    onFetchProfile(userInfo);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      onFetchProfile,
      userInfo,
      location: { hash },
    } = this.props;
    if (prevProps.userInfo.userID !== userInfo.userID) {
      onFetchProfile(userInfo);
    }

    const hasHashChanged = prevProps.location.hash !== hash;

    if (hasHashChanged) {
      this.setState({ currentMenuItem: hash });
    }
  }

  componentWillUnmount() {
    const { onDeleteProfile } = this.props;
    onDeleteProfile();
  }

  submit = async values => {
    const { profile, onUpdateProfile } = this.props;

    const isRoleChanged = Object.prototype.hasOwnProperty.call(values, 'roles');

    const mergedProfile = {
      ...profile,
      ...values,
    };
    const roles = mergedProfile.roles;

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

    onUpdateProfile(mergedProfile);
  };

  handleMenuClick = e => {
    this.setState({
      currentMenuItem: e.key,
    });
  };

  render() {
    const {
      isLoading,
      error,
      profile,
      userInfo,
      location: { hash },
      isProfileUpdating,
    } = this.props;

    const { currentMenuItem } = this.state;

    if (isLoading) {
      return (
        <Layout className={'up-is-loading-layout'}>
          <Spin indicator={<Icon type="loading" className={'up-spin'} spin />} />
        </Layout>
      );
    } else if (error) {
      return <Error />;
    } else if (isEmpty(profile)) {
      return <Error text={'404: Page not found.'} />;
    }

    return (
      <UserProfilePage
        profile={profile}
        updateProfileCb={this.submit}
        canEdit={userInfo.isSelf}
        hash={hash}
        key={currentMenuItem} // Allows to create a new component instance when hash is changed.
        handleMenuClickCb={this.handleMenuClick}
        currentMenuItem={currentMenuItem}
        isProfileUpdating={isProfileUpdating}
      />
    );
  }
}

const mapStateToProps = state => ({
  profile: selectProfile(state),
  isLoading: selectIsProfileLoading(state),
  error: selectErrorProfile(state),
  isProfileUpdating: selectIsProfileUpdating(state),
});

const mapDispatchToProps = dispatch => {
  return {
    onFetchProfile: userInfo => dispatch(fetchProfileIfNeeded(userInfo)),
    onUpdateProfile: user => dispatch(updateUserProfile(user)),
    onDeleteProfile: () => dispatch(deleteProfile()),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(UserProfilePageContainer);
