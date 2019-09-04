import { difference } from 'lodash';

export const isRoleDiffThanPxOrFamOrCommunity = (profile = {}) => {
  if (Object.keys(profile).length === 0) {
    return false;
  }
  const profileRoles = profile.roles.map(r => r.toLowerCase());
  return difference(profileRoles, ['patient', 'community']).length > 0;
};
