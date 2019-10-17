import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  selectProfile,
  selectIsProfileLoading,
  selectErrorProfile,
} from '../../store/selectors/users';
import { fetchProfileIfNeeded, updateUserProfile } from '../../store/actionCreators/user';
import Error from '../Error';
import isEmpty from 'lodash/isEmpty';
import UserProfilePage from './UserProfilePage';

class UserProfileContainer extends React.Component {
  static propTypes = {
    profile: PropTypes.object,
    onFetchProfile: PropTypes.func.isRequired,
    onUpdateProfile: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.object,
    userID: PropTypes.string,
  };

  componentDidMount() {
    const { onFetchProfile } = this.props;
    onFetchProfile();
  }

  canEdit = () => !Boolean(this.props.userID);

  submit = values => {
    const { profile, onUpdateProfile } = this.props;
    onUpdateProfile({
      ...profile,
      ...values,
    });
  };

  /**
   *  TODOs 
   * - add antd spinner
   * - test how error behaves and display it accordingly 
   *    import inRange from 'lodash/inRange';
        const errorStatus = error.response.status;
        const text = inRange(errorStatus, 400) ? error.message : undefined;
  */

  render() {
    const { isLoading, error, profile } = this.props;
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
        onSummitUpdateProfile={this.submit}
        canEdit={this.canEdit()}
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
    onFetchProfile: userID => dispatch(fetchProfileIfNeeded(userID)),
    onUpdateProfile: () => dispatch(updateUserProfile()),
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(UserProfileContainer);
