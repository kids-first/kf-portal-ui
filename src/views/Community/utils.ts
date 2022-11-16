import { IMemberEntity } from 'graphql/members/models';
import { IPersonaUser } from 'services/api/persona/models';

export const formatName = (user: IPersonaUser | IMemberEntity) =>
  user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email;

export const formatCountryAndState = (user: IPersonaUser | IMemberEntity) => {
  if (user.state && user.country) {
    return `${user.state}, ${user.country}`;
  }

  if (user.state) {
    return `${user.state}`;
  }

  return `${user.country}`;
};
