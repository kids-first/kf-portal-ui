import { TPersonaUser } from 'services/api/persona/models';

export const formatName = (user: TPersonaUser) =>
  user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email;

export const formatCountryAndState = (user: TPersonaUser) => {
  if (user.state && user.country) {
    return `${user.state}, ${user.country}`;
  }

  if (user.state) {
    return `${user.state}`;
  }

  return `${user.country}`;
};
