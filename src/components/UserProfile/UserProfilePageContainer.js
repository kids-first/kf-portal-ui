import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  selectProfile,
  selectLoggedInUser,
  selectIsProfileLoading,
  selectErrorProfile,
} from '../../store/selectors/users';
import { fetchProfileIfNeeded, updateUserProfile } from '../../store/actionCreators/user';
import Error from '../Error';
import isEmpty from 'lodash/isEmpty';
import UserProfilePage from './UserProfilePage';

class UserProfilePageContainer extends React.Component {
  static propTypes = {
    profile: PropTypes.object,
    onFetchProfile: PropTypes.func.isRequired,
    onUpdateProfile: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.object,
    userID: PropTypes.string,
    loggedInUser: PropTypes.object,
  };

  componentDidMount() {
    const { onFetchProfile, theme } = this.props;
    onFetchProfile();
  }

  canEdit = () => !Boolean(this.props.userID);

  submit = values => {
    console.log("SUBMIT", values);
    const { profile, onUpdateProfile } = this.props;
    onUpdateProfile({
      ...profile,
      ...values,
    });
  };

  /**
   *  TODOs 
   * - simplify logic in app's route to determine who's who.
   * - add antd spinner
   * - test how error behaves and display it accordingly 
   *    import inRange from 'lodash/inRange';
        const errorStatus = error.response.status;
        const text = inRange(errorStatus, 400) ? error.message : undefined;
  */

  render() {
    const { isLoading, error, profile, loggedInUser } = this.props;
    if (isLoading) {
      return '...loading'; //TODO mettre un spinner
    } else if (error) {
      return <Error text={'TODO'} />;
    } else if (isEmpty(profile)) {
      return <Error text={'404: Page not found.'} />;
    }
    return (
      <UserProfilePage
        profile={profile}
        onSubmitUpdateProfile={this.submit}
        canEdit={this.canEdit()}
        loggedInUser={loggedInUser}
      />
    );
  }
}

const mapStateToProps = state => ({
  profile: selectProfile(state),
  loggedInUser: selectLoggedInUser(state),
  isLoading: selectIsProfileLoading(state),
  error: selectErrorProfile(state),
});

const mapDispatchToProps = dispatch => {
  return {
    onFetchProfile: userID => dispatch(fetchProfileIfNeeded(userID)),
    onUpdateProfile: user => dispatch(updateUserProfile(user)),
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(UserProfilePageContainer);
