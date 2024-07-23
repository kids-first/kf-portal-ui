import { TUser } from 'services/api/user/models';

export const formatName = (user: TUser) =>
  user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.email;

export const formatCountryAndState = (user: TUser) => {
  if (user.location_state && user.location_country) {
    return `${user.location_state}, ${user.location_country}`;
  }

  if (user.location_state) {
    return `${user.location_state}`;
  }

  return `${user.location_country}`;
};
