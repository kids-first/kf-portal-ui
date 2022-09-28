import { TPersonaUser } from 'services/api/persona/models';

export const formatName = (user: TPersonaUser) =>
  user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email;
