import { TPersonaUser } from 'services/api/persona/models';

export type initialState = {
  personaUserInfo: TPersonaUser | undefined | null;
  isLoading: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error?: string;
};
