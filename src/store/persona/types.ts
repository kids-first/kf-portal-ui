import { IPersonaUser } from 'services/api/persona/models';

export type initialState = {
  personaUserInfo?: IPersonaUser;
  profile?: IPersonaUser;
  isLoading: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error?: string;
};
