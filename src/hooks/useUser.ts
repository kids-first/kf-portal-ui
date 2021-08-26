import { useSelector } from 'react-redux';

import { RootState } from 'store/rootState';
import { selectIsLoadingUser, selectUser, selectUserGroups } from 'store/selectors/users';
import { Groups, User } from 'store/userTypes';

type Output = {
  user: User | null;
  isLoadingUser: boolean;
  groups: Groups;
};

const useUser = (): Output => ({
  user: useSelector((state: RootState) => selectUser(state)),
  isLoadingUser: useSelector((state: RootState) => selectIsLoadingUser(state)),
  groups: useSelector((state: RootState) => selectUserGroups(state)),
});
export default useUser;
