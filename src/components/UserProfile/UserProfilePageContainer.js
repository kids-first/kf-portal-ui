import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  selectProfile,
  selectIsProfileLoading,
  selectErrorProfile,
} from '../../store/selectors/users';
import {
  fetchProfileIfNeeded,
  updateUserProfile,
  deleteProfile,
} from '../../store/actionCreators/user';
import Error from '../Error';
import isEmpty from 'lodash/isEmpty';
import UserProfilePage from './UserProfilePage';
import { Spin, Icon, Layout } from 'antd';
import { withRouter } from 'react-router-dom';

const KEY_ABOUT_ME = 'aboutMe';
const KEY_SETTINGS = 'settings';

const getKeyFromHash = hash => {
  if (hash === `#${KEY_SETTINGS}`) {
    return KEY_SETTINGS;
  }
  return KEY_ABOUT_ME;
};

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
  };

  state = {
    currentMenuItem: getKeyFromHash(this.props.hash),
  };

  componentDidMount() {
    const { onFetchProfile, userInfo } = this.props;
    onFetchProfile(userInfo);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.userInfo.userID !== this.props.userInfo.userID) {
      const { onFetchProfile, userInfo } = this.props;
      onFetchProfile(userInfo);
    }
  }

  componentWillUnmount() {
    const { onDeleteProfile } = this.props;
    onDeleteProfile();
  }

  submit = values => {
    const { profile, onUpdateProfile } = this.props;
    onUpdateProfile({
      ...profile,
      ...values,
    });
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
    } = this.props;

    const { currentMenuItem } = this.state;

    if (isLoading) {
      return (
        <Layout style={{ justifyContent: 'center' }}>
          <Spin indicator={<Icon type="loading" style={{ fontSize: 48 }} spin />} />
        </Layout>
      );
    } else if (error) {
      return <Error text={'TODO'} />;
    } else if (isEmpty(profile)) {
      return <Error text={'404: Page not found.'} />;
    }

    return (
      <UserProfilePage
        profile={profile}
        updateProfileCb={this.submit}
        canEdit={userInfo.isSelf}
        hash={hash}
        key={hash} // Allows to create a new component instance when hash is changed.
        handleMenuClickCb={this.handleMenuClick}
        currentMenuItem={currentMenuItem}
      />
    );
  }
}

const mapStateToProps = state => ({
  profile: selectProfile(state),
  isLoading: selectIsProfileLoading(state),
  error: selectErrorProfile(state),
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
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(UserProfilePageContainer);
