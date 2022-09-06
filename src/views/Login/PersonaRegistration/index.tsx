import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useKeycloak } from '@react-keycloak/web';
import { KidsFirstKeycloakTokenParsed } from 'common/tokenTypes';
import { fetchPersonaUser } from 'store/persona/thunks';
import { REDIRECT_URI_KEY } from 'common/constants';
import useQueryParams from 'hooks/useQueryParams';
import { STATIC_ROUTES } from 'utils/routes';

import Registration from './RegistrationForm';
import TermsConditions from './TermsConditions';
import { usePersona } from 'store/persona';
import Spinner from 'components/uiKit/Spinner';

enum Step {
  LOADING,
  TERMSANDCONDITIONS,
  REGISTRATION,
}

const PersonaRegistration = () => {
  const { personaUserInfo } = usePersona();
  const query = useQueryParams();
  const dispatch = useDispatch();
  const [step, setStep] = useState(Step.TERMSANDCONDITIONS);
  const { keycloak } = useKeycloak();
  const tokenParsed = keycloak?.tokenParsed as KidsFirstKeycloakTokenParsed;

  useEffect(() => {
    // if the use tried to acces the registration page wihout using keycloack login
    if (!tokenParsed?.sub!) {
      window.location.assign(`${window.location.origin}/${STATIC_ROUTES.LOGIN}`);
      return;
    }

    if (personaUserInfo === undefined) {
      dispatch(
        fetchPersonaUser({
          egoId: tokenParsed.sub,
          lastName: tokenParsed.family_name,
          firstName: tokenParsed.given_name,
          email: tokenParsed.email,
        }),
      );
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personaUserInfo, tokenParsed]);

  useEffect(() => {
    if (
      personaUserInfo?.acceptedTerms &&
      personaUserInfo?.email &&
      personaUserInfo?.firstName &&
      personaUserInfo?.lastName
    ) {
      const url = keycloak.createLoginUrl({
        // eslint-disable-next-line max-len
        redirectUri: `${window.location.origin}/${
          query.get(REDIRECT_URI_KEY) || STATIC_ROUTES.DASHBOARD
        }`,
      });
      window.location.assign(url);
      return;
    }
  });

  if (step === Step.LOADING || personaUserInfo?.acceptedTerms || !tokenParsed?.sub) {
    return <Spinner size={'large'} />;
  }

  return (
    <>
      <TermsConditions
        hidden={!(step === Step.TERMSANDCONDITIONS)}
        onFinish={() => {
          setStep(Step.REGISTRATION);
        }}
      />

      <Registration
        hidden={!(step === Step.REGISTRATION)}
        handleBack={() => setStep(Step.TERMSANDCONDITIONS)}
        kcToken={tokenParsed}
        onFinishCallback={() => setStep(Step.LOADING)}
      />
    </>
  );
};

export default PersonaRegistration;
