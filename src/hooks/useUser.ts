import { useSelector } from 'react-redux';

import { RootState } from 'store/rootState';
import {
  selectIsLoadingUser,
  selectIsUserAuthenticated,
  selectLoginProvider,
  selectUser,
  selectUserGroups,
  selectUserToken,
} from 'store/selectors/users';
import { Groups, Provider, User } from 'store/userTypes';

type Output = {
  user: User | null;
  isLoadingUser: boolean;
  groups: Groups;
  userToken: string | null;
  loginProvider: Provider | null;
  isAuthenticated: boolean;
};

const useUser = (): Output => ({
  user: useSelector((state: RootState) => selectUser(state)),
  isLoadingUser: useSelector((state: RootState) => selectIsLoadingUser(state)),
  groups: useSelector((state: RootState) => selectUserGroups(state)),
  userToken: useSelector((state: RootState) => selectUserToken(state)),
  loginProvider: useSelector((state: RootState) => selectLoginProvider(state)),
  isAuthenticated: useSelector((state: RootState) => selectIsUserAuthenticated(state)),
});
export default useUser;
