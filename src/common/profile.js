import { ROLES } from './constants';

export const extractInfoFromRoles = (roles) => {
  if (!Array.isArray(roles) || roles.length === 0) {
    return null;
  }

  const role = roles[0];
  const displayInfo = ROLES.find((r) => r.type === role);
  const Icon = displayInfo.icon;
  const backgroundColor = displayInfo.color;
  const roleName = displayInfo.displayName;

  return {
    roleName,
    backgroundColor,
    Icon,
  };
};

export const isPartOfGroup = (group, egoGroups) => (egoGroups || []).includes(group);

export const isKfInvestigator = (egoGroups) => isPartOfGroup('kf-investigator', egoGroups);
