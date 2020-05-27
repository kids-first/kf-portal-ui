import React from 'react';
import get from 'lodash/get';
import find from 'lodash/find';
import { ROLES } from 'common/constants';

import {
  roleIconContainer,
  roleIconDisplayName,
  roleIconDisplayNameLabel,
} from './RoleIconButton.module.css';

const roleLookup = ROLES.reduce((acc, { type, ...x }) => ({ ...acc, [type]: x }), {});

const RoleIconButton = ({ className = '', children, profile }) => {
  const userRole = get(profile, ['roles', 0]);
  const userRoleDisplayName = find(ROLES, { type: userRole }).displayName;
  const RoleIcon = get(roleLookup, [userRole, 'icon'], null);
  const background = get(roleLookup, [userRole, 'color'], null);

  return (
    <div className={`${roleIconContainer} ${className}`} style={`background-color: ${background}`}>
      <RoleIcon
        height="45px"
        fill="#fff"
        style={{
          'margin-right': '11px',
          flex: 'none',
        }}
      />
      <div className={roleIconDisplayName}>
        <div className={roleIconDisplayNameLabel}>{'>'}{userRoleDisplayName}</div>
        {children}
      </div>
    </div>
  );
};

export default RoleIconButton;
