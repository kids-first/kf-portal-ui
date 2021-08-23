import { store } from 'store';
import { revertAcceptedTermsThenLogoutCleanly } from 'store/actionCreators/user';

export const uiLogout = async () => {
  await store.dispatch(revertAcceptedTermsThenLogoutCleanly());
};
