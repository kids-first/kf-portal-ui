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

  render() {
    const {
      isLoading,
      error,
      profile,
      userInfo,
      location: { hash },
    } = this.props;

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
        onSubmitUpdateProfile={this.submit}
        canEdit={userInfo.isSelf}
        hash={hash}
        key={hash}// Allows to create a new component instance when hash is changed.
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
