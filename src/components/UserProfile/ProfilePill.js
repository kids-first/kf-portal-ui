import React from 'react';
import PropTypes from 'prop-types';
import { ROLES } from 'common/constants';
import { extractInfoFromRoles } from 'common/profile';

const MAX_N_OF_CHARACTER = 10;

const computeSizeGivenRole = displayName => {
  const rolesThatFitSmallSize = ROLES.map(r => r.displayName).filter(
    r => r.length <= MAX_N_OF_CHARACTER,
  );
  const isSmallFit = rolesThatFitSmallSize.includes(displayName);

  return { height: isSmallFit ? 24 : 34, width: isSmallFit ? '65%' : '80%' };
};

const ProfilePill = props => {
  const { roles } = props;
  const { Icon, backgroundColor, roleName } = extractInfoFromRoles(roles);

  const { height, width } = computeSizeGivenRole(roleName);

  return (
    <div
      className={'pp-main'}
      style={{
        height,
        backgroundColor,
        width,
      }}
    >
      <Icon height={`${height}px`} fill="#fff" />
      <div className={'pp-role-name-wrapper'}>{roleName}</div>
    </div>
  );
};

export default ProfilePill;

ProfilePill.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string),
};
