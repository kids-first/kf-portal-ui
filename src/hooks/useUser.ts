import { useSelector } from 'react-redux';

import { RootState } from 'store/rootState';

import {
  selectIsLoadingUser,
  selectIsUserAuthenticated,
  selectLoginProvider,
  selectUser,
  selectUserGroups,
  selectUserToken,
} from '../store/selectors/users';
import { Groups, Provider, User } from '../store/userTypes';

type Output = {
  user: User | null;
  isLoadingUser: boolean;
  groups: Groups;
  userToken: string | null;
  loginProvider: Provider | null;
  isAuthenticated: boolean;
};

const useUser = (): Output => {
  const user = useSelector((state: RootState) => selectUser(state));
  const isLoadingUser = useSelector((state: RootState) => selectIsLoadingUser(state));
  const groups = useSelector((state: RootState) => selectUserGroups(state));
  const userToken = useSelector((state: RootState) => selectUserToken(state));
  const loginProvider = useSelector((state: RootState) => selectLoginProvider(state));
  const isAuthenticated = useSelector((state: RootState) => selectIsUserAuthenticated(state));

  return {
    user,
    isLoadingUser,
    groups,
    userToken,
    loginProvider,
    isAuthenticated,
  };
};
export default useUser;
