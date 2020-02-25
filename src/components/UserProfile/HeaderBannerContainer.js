import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  selectErrorIsToggleProfileStatus,
  selectIsLoadingProfileStatus,
  selectProfile,
} from '../../store/selectors/users';
import { cleanErrors, toggleIsActive, toggleIsPublic } from '../../store/actionCreators/user';
import HeaderBanner from 'components/UserProfile/HeaderBanner';
import { notification } from 'antd';
import { getMsgFromAccessError } from './utils';

const HeaderBannerContainer = props => {
  const {
    isLoading,
    error,
    profile,
    canEdit,
    isAdmin,
    onCleanErrors,
    onToggleIsPublic,
    onToggleIsActive,
  } = props;
  useEffect(() => {
    if (error) {
      /**
       * FIXME:
       *  This notification should not be the responsibility of this component.
       *  When a global notification system will be implemented remove this effect from this component
       *  and let it manage this notification.
       * */
      notification.error({
        message: 'Error',
        description: getMsgFromAccessError(error, 'An error occurred while updating the profile'),
        duration: 10, //[sec]
        onClose: () => onCleanErrors(),
      });
    }
  }, [error, onCleanErrors]);

  return (
    <HeaderBanner
      onChangePrivacyStatusCb={() =>
        onToggleIsPublic({
          ...profile,
          ...{ isPublic: !profile.isPublic },
        })
      }
      onChangeActivityStatusCb={() =>
        onToggleIsActive({
          ...profile,
          ...{ isActive: !profile.isActive },
        })
      }
      profile={profile}
      isLoading={isLoading}
      error={error}
      canEdit={canEdit}
      isAdmin={isAdmin}
    />
  );
};

HeaderBannerContainer.propTypes = {
  /** we must always have a non empty profile here */
  profile: PropTypes.object,
  onToggleIsPublic: PropTypes.func.isRequired,
  onToggleIsActive: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  canEdit: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  onCleanErrors: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  profile: selectProfile(state),
  isLoading: selectIsLoadingProfileStatus(state),
  error: selectErrorIsToggleProfileStatus(state),
});

const mapDispatchToProps = dispatch => {
  return {
    onToggleIsPublic: profile => dispatch(toggleIsPublic(profile)),
    onToggleIsActive: profile => dispatch(toggleIsActive(profile)),
    onCleanErrors: () => dispatch(cleanErrors()),
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(HeaderBannerContainer);
