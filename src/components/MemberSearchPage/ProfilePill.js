import React from 'react';
import PropTypes from 'prop-types';
import { ROLES } from 'common/constants';

const ProfilePill = props => {
  const { roles } = props;
  if (!Array.isArray(roles) || roles.length === 0) {
    return null;
  }

  const role = roles[0];
  const displayInfo = ROLES.find(r => r.type === role);
  const Icon = displayInfo.icon;
  const backgroundColor = displayInfo.color;
  const roleName = displayInfo.displayName;

  return (
    <div
      style={{
        display: 'flex',
        height: 15,
        borderRadius: '21px',
        backgroundColor,
        color: 'white',
        fontSize: '10px',
        fontWeight: '300',
        lineHeight: 1.86,
        letterSpacing: '0.2px',
        textAlign: 'left',
        textTransform: 'capitalize',
        padding: ' 0 16px 0 0',
        width: 100,
        margin: 'auto',
      }}
    >
      <Icon height={'inherit'} fill="#fff" />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          fontWeight: 'bold',
          fontSize: 10,
        }}
      >
        {roleName}
      </div>
    </div>
  );
};

export default ProfilePill;

ProfilePill.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string),
};
