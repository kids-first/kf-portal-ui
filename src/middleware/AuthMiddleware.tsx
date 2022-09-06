import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useKeycloak } from '@react-keycloak/web';
import Spinner from 'components/uiKit/Spinner';
import { useUser } from 'store/user';
import { fetchUser } from 'store/user/thunks';
import { userActions } from 'store/user/slice';
import { fetchSavedFilters, fetchSharedSavedFilter } from 'store/savedFilter/thunks';
import { useSavedFilter } from 'store/savedFilter';
import useQueryParams from 'hooks/useQueryParams';
import { SHARED_FILTER_ID_QUERY_PARAM_KEY } from 'common/constants';
import { fetchSavedSet } from 'store/savedSet/thunks';
import { usePersona } from 'store/persona';
import { fetchPersonaUser } from 'store/persona/thunks';
import { personaActions } from 'store/persona/slice';
import { KidsFirstKeycloakTokenParsed } from 'common/tokenTypes';

type Props = {
  children: React.ReactElement;
};

// @TODO: KEYCLOACK remove persona and use userInfo when keycloack is done
const AuthMiddleware = ({ children }: Props) => {
  const { isLoading } = useUser();
  const { isLoading: personaIsLoading } = usePersona();
  const { isLoading: isSavedFilterLoading } = useSavedFilter();
  const { keycloak } = useKeycloak();
  const tokenParsed = keycloak?.tokenParsed as KidsFirstKeycloakTokenParsed;
  const dispatch = useDispatch();
  const params = useQueryParams();

  useEffect(() => {
    const sharedFilterId = params.get(SHARED_FILTER_ID_QUERY_PARAM_KEY);
    if (sharedFilterId) {
      dispatch(fetchSharedSavedFilter(sharedFilterId));
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (keycloak.authenticated) {
      console.log('AUTH_MIDDLEWARE: keycloack is authenticated'); //TODO: to remove
      dispatch(
        fetchPersonaUser({
          egoId: tokenParsed.sub,
          lastName: tokenParsed.family_name,
          firstName: tokenParsed.given_name,
          email: tokenParsed.email,
        }),
      );
      dispatch(fetchUser());
      dispatch(fetchSavedFilters());
      dispatch(fetchSavedSet());
    } else {
      dispatch(personaActions.setIsPersonaLoading(false));
      dispatch(userActions.setIsUserLoading(false));
    }
    // eslint-disable-next-line
  }, [keycloak]);

  return isLoading || personaIsLoading || isSavedFilterLoading ? (
    <Spinner size={'large'} />
  ) : (
    children
  );
};

export default AuthMiddleware;
