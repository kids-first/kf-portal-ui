import { TUser } from 'services/api/user/models';

export type initialState = {
  userInfo?: TUser;
  groups: string[];
  isLoading: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error?: string;
};
