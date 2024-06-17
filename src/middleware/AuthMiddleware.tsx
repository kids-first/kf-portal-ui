import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SHARED_BIOSPECIMEN_REQUEST_ID_QUERY_PARAM_KEY } from '@ferlab/ui/core/components/BiospecimenRequest/requestBiospecimen.utils';
import { useKeycloak } from '@react-keycloak/web';

import { SHARED_FILTER_ID_QUERY_PARAM_KEY } from 'common/constants';
import { KidsFirstKeycloakTokenParsed } from 'common/tokenTypes';
import Spinner from 'components/uiKit/Spinner';
import useQueryParams from 'hooks/useQueryParams';
import { usePersona } from 'store/persona';
import { personaActions } from 'store/persona/slice';
import { fetchPersonaUser } from 'store/persona/thunks';
import { useSavedFilter } from 'store/savedFilter';
import { fetchSavedFilters, fetchSharedSavedFilter } from 'store/savedFilter/thunks';
import { fetchSavedSet, fetchSharedBiospecimenRequest } from 'store/savedSet/thunks';
import { useUser } from 'store/user';
import { userActions } from 'store/user/slice';
import { fetchUser } from 'store/user/thunks';

type Props = {
  children: React.ReactElement;
};

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
    const biospecimenRequestId = params.get(SHARED_BIOSPECIMEN_REQUEST_ID_QUERY_PARAM_KEY);
    if (sharedFilterId) {
      dispatch(fetchSharedSavedFilter(sharedFilterId));
    }
    if (biospecimenRequestId) {
      dispatch(fetchSharedBiospecimenRequest(biospecimenRequestId));
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (keycloak.authenticated) {
      dispatch(
        fetchPersonaUser({
          egoId: tokenParsed.sub,
          lastName: tokenParsed.family_name,
          firstName: tokenParsed.given_name,
          email: tokenParsed.email,
        }),
      );
      dispatch(userActions.setUserGroups(tokenParsed?.groups));
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
