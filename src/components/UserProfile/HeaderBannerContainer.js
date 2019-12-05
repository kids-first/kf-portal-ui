import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  selectIsLoadingProfileStatus,
  selectProfile,
  selectErrorIsToggleProfileStatus,
} from '../../store/selectors/users';
import { toggleIsPublic } from '../../store/actionCreators/user';
import HeaderBanner from 'components/UserProfile/HeaderBanner';

class HeaderBannerContainer extends React.Component {
  static propTypes = {
    /** we must always have a non empty profile here */
    profile: PropTypes.object,
    onToggleIsPublic: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.object,
    canEdit: PropTypes.bool.isRequired,
  };

  onChangePrivacyStatus = () => {
    const { profile, onToggleIsPublic } = this.props;
    onToggleIsPublic({
      ...profile,
      ...{ isPublic: !profile.isPublic },
    });
  };

  render() {
    const { isLoading, error, profile, canEdit } = this.props;
    return (
      <HeaderBanner
        onChangePrivacyStatusCb={this.onChangePrivacyStatus}
        profile={profile}
        isLoading={isLoading}
        error={error}
        canEdit={canEdit}
      />
    );
  }
}

const mapStateToProps = state => ({
  profile: selectProfile(state),
  isLoading: selectIsLoadingProfileStatus(state),
  error: selectErrorIsToggleProfileStatus(state),
});

const mapDispatchToProps = dispatch => {
  return {
    onToggleIsPublic: profile => dispatch(toggleIsPublic(profile)),
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(HeaderBannerContainer);
