import { TPersonaUser } from 'services/api/persona/models';

export type initialState = {
  personaUserInfo?: TPersonaUser;
  profile?: TPersonaUser;
  isLoading: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error?: string;
};
