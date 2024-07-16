import { TUser } from '../../services/api/user/models';

export type initialState = {
  users: TUser[];
  total: number;
  error?: boolean;
  loading: boolean;
};
