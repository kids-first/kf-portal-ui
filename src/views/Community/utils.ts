import { TUser } from 'services/api/user/models';

export const formatName = (user: TUser) =>
  user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.email;
