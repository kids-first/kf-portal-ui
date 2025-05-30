import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// eslint-disable-next-line max-len
import { SHARED_BIOSPECIMEN_REQUEST_ID_QUERY_PARAM_KEY } from '@ferlab/ui/core/components/BiospecimenRequest/requestBiospecimen.utils';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { SET_ID_PREFIX } from '@ferlab/ui/core/data/sqon/types';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { useKeycloak } from '@react-keycloak/web';

import {
  SHARED_FILTER_ID_QUERY_PARAM_KEY,
  SHARED_SET_ID_QUERY_PARAM_KEY,
  SHARED_SET_TYPE_QUERY_PARAM_KEY,
} from 'common/constants';
import { SET_TYPE_QB_ID_MAPPING } from 'common/queryBuilder';
import { KidsFirstKeycloakTokenParsed } from 'common/tokenTypes';
import Spinner from 'components/uiKit/Spinner';
import useQueryParams from 'hooks/useQueryParams';
import { SetType } from 'services/api/savedSet/models';
import { useSavedFilter } from 'store/savedFilter';
import { fetchSavedFilters, fetchSharedSavedFilter } from 'store/savedFilter/thunks';
import { getSetFieldId } from 'store/savedSet';
import { fetchSavedSet, fetchSharedBiospecimenRequest } from 'store/savedSet/thunks';
import { useUser } from 'store/user';
import { userActions } from 'store/user/slice';
import { fetchUser } from 'store/user/thunks';

type Props = {
  children: React.ReactElement;
};

const AuthMiddleware = ({ children }: Props) => {
  const { isLoading } = useUser();
  const { isLoading: isSavedFilterLoading } = useSavedFilter();
  const { keycloak } = useKeycloak();
  const tokenParsed = keycloak?.tokenParsed as KidsFirstKeycloakTokenParsed;
  const dispatch = useDispatch();
  const params = useQueryParams();

  useEffect(() => {
    if (keycloak.authenticated) {
      dispatch(fetchUser());
      dispatch(userActions.setUserGroups(tokenParsed?.groups));
      dispatch(fetchSavedFilters());
      dispatch(fetchSavedSet());
      const sharedFilterId = params.get(SHARED_FILTER_ID_QUERY_PARAM_KEY);
      const biospecimenRequestId = params.get(SHARED_BIOSPECIMEN_REQUEST_ID_QUERY_PARAM_KEY);
      const sharedSetId = params.get(SHARED_SET_ID_QUERY_PARAM_KEY);
      const sharedSetType = params.get(SHARED_SET_TYPE_QUERY_PARAM_KEY);
      if (sharedFilterId) {
        dispatch(fetchSharedSavedFilter(sharedFilterId));
      }
      if (biospecimenRequestId) {
        dispatch(fetchSharedBiospecimenRequest(biospecimenRequestId));
      }
      if (sharedSetId && sharedSetType) {
        const setValue = `${SET_ID_PREFIX}${sharedSetId}`;

        addQuery({
          queryBuilderId: SET_TYPE_QB_ID_MAPPING[sharedSetType],
          query: generateQuery({
            newFilters: [
              generateValueFilter({
                field: getSetFieldId(sharedSetType as SetType),
                value: [setValue],
                index: sharedSetType,
              }),
            ],
          }),
          setAsActive: true,
        });
      }
    } else {
      dispatch(userActions.setIsUserLoading(false));
    }
    // eslint-disable-next-line
  }, [keycloak]);

  return isLoading || isSavedFilterLoading ? <Spinner size={'large'} /> : children;
};

export default AuthMiddleware;
