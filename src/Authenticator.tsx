import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useKeycloak } from '@react-keycloak/web';

import { fetchUserIfNeededWithLoader, toggleIsLoadingUser } from './store/actionCreators/user';
import { RootState } from './store/rootState';
import { selectIsLoadingUser } from './store/selectors/users';
import { Spinner } from './uikit/Spinner';

type Props = {
  children: React.ReactNode;
};

const Authenticator = (props: Props) => {
  const { children } = props;

  const dispatch = useDispatch();

  const { keycloak } = useKeycloak();

  useEffect(() => {
    if (keycloak.authenticated) {
      dispatch(fetchUserIfNeededWithLoader());
    } else {
      dispatch(toggleIsLoadingUser(false));
    }
  }, [dispatch, keycloak]);

  const isLoadingUser = useSelector((state: RootState) => selectIsLoadingUser(state));

  if (isLoadingUser) {
    return <Spinner className={'spinner'} size={'large'} />;
  }

  return children;
};

export default Authenticator;
