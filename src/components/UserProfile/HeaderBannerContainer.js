import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  selectIsLoadingProfileStatus,
  selectProfile,
  selectErrorIsToggleProfileStatus,
} from '../../store/selectors/users';
import { toggleIsPublic, toggleIsActive } from '../../store/actionCreators/user';
import HeaderBanner from 'components/UserProfile/HeaderBanner';

class HeaderBannerContainer extends React.Component {
  static propTypes = {
    /** we must always have a non empty profile here */
    profile: PropTypes.object,
    onToggleIsPublic: PropTypes.func.isRequired,
    onToggleIsActive: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.object,
    canEdit: PropTypes.bool.isRequired,
    isAdmin: PropTypes.bool.isRequired,
  };

  onChangePrivacyStatus = () => {
    const { profile, onToggleIsPublic } = this.props;
    onToggleIsPublic({
      ...profile,
      ...{ isPublic: !profile.isPublic },
    });
  };

  onChangeActivityStatus = () => {
    const { profile, onToggleIsActive } = this.props;
    onToggleIsActive({
      ...profile,
      ...{ isActive: !profile.isActive },
    });
  };

  render() {
    const { isLoading, error, profile, canEdit, isAdmin } = this.props;
    return (
      <HeaderBanner
        onChangePrivacyStatusCb={this.onChangePrivacyStatus}
        onChangeActivityStatusCb={this.onChangeActivityStatus}
        profile={profile}
        isLoading={isLoading}
        error={error}
        canEdit={canEdit}
        isAdmin={isAdmin}
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
    onToggleIsActive: profile => dispatch(toggleIsActive(profile)),
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(HeaderBannerContainer);
