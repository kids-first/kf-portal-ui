import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useKeycloak } from '@react-keycloak/web';
import { KidsFirstKeycloakTokenParsed } from 'common/tokenTypes';
import { REDIRECT_URI_KEY } from 'common/constants';
import useQueryParams from 'hooks/useQueryParams';
import { STATIC_ROUTES } from 'utils/routes';

import TermsConditions from './components/TermsConditions';
import { usePersona } from 'store/persona';
import { updatePersonaUser } from 'store/persona/thunks';

const PersonaUpdateTermsAndConditions = () => {
  const { personaUserInfo } = usePersona();
  const query = useQueryParams();
  const dispatch = useDispatch();
  const { keycloak } = useKeycloak();
  const tokenParsed = keycloak?.tokenParsed as KidsFirstKeycloakTokenParsed;
  console.log('personaUserInfo', personaUserInfo); //TODO: to remove

  useEffect(() => {
    if (!tokenParsed?.sub! || !personaUserInfo) {
      window.location.assign(`${window.location.origin}/${STATIC_ROUTES.LOGIN}`);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personaUserInfo, tokenParsed]);

  return (
    <>
      <TermsConditions
        onFinish={() => {
          dispatch(
            updatePersonaUser({
              data: {
                ...personaUserInfo,
                acceptedTerms: true,
              },
              callback: () => {
                const url = keycloak.createLoginUrl({
                  // eslint-disable-next-line max-len
                  redirectUri: `${window.location.origin}/${
                    query.get(REDIRECT_URI_KEY) || STATIC_ROUTES.DASHBOARD
                  }`,
                });
                window.location.assign(url);
              },
            }),
          );
        }}
      />
    </>
  );
};

export default PersonaUpdateTermsAndConditions;
