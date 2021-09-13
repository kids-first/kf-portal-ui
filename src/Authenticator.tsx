import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { EGO_JWT_KEY, LOGIN_PROVIDER } from './common/constants';
import { manageUserTokenWithLoader, toggleIsLoadingUser } from './store/actionCreators/user';
import { RootState } from './store/rootState';
import { selectIsLoadingUser } from './store/selectors/users';
import { Spinner } from './uikit/Spinner';

type Props = {
  children: React.ReactNode;
};

const Authenticator = (props: Props) => {
  const { children } = props;

  const dispatch = useDispatch();

  useEffect(() => {
    const jwtFromLocalStorage = localStorage.getItem(EGO_JWT_KEY);
    const providerFromLocalStorage = localStorage.getItem(LOGIN_PROVIDER);
    if (jwtFromLocalStorage && providerFromLocalStorage) {
      dispatch(manageUserTokenWithLoader(jwtFromLocalStorage, providerFromLocalStorage));
    } else {
      dispatch(toggleIsLoadingUser(false));
    }
  }, [dispatch]);

  const isLoadingUser = useSelector((state: RootState) => selectIsLoadingUser(state));

  return isLoadingUser ? <Spinner className={'spinner'} size={'large'} /> : children;
};

export default Authenticator;
