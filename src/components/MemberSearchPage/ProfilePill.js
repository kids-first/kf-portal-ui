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
        display: 'inline-flex',
        height: 24,
        borderRadius: '21px',
        backgroundColor,
        color: 'white',
        fontSize: '10px',
        fontWeight: '300',
        lineHeight: 1.86,
        letterSpacing: '0.2px',
        textAlign: 'left',
        textTransform: 'capitalize',
        padding: ' 0 10px 0 0',
        margin: 'auto',
      }}
    >
      <Icon
        fill="#fff"
        style={{ height: 20, marginRight: 8, position: 'relative', left: 2, bottom: -2 }}
      />
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
