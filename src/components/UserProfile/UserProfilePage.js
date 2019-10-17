import React from 'react';
import PropTypes from 'prop-types';

const UserProfilePage = ({ profile, onSummitUpdateProfile, canEdit }) => {
  return <div>TODO</div>;
};

UserProfilePage.propTypes = {
  profile: PropTypes.object.isRequired,
  onSummitUpdateProfile: PropTypes.func.isRequired,
  canEdit: PropTypes.bool.isRequired,
};

export default UserProfilePage;
