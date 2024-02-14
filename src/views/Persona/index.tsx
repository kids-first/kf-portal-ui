import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useKeycloak } from '@react-keycloak/web';

import { REDIRECT_URI_KEY } from 'common/constants';
import { KidsFirstKeycloakTokenParsed } from 'common/tokenTypes';
import Spinner from 'components/uiKit/Spinner';
import useQueryParams from 'hooks/useQueryParams';
import { trackRegistrationStarted } from 'services/analytics';
import { usePersona } from 'store/persona';
import { fetchPersonaUser } from 'store/persona/thunks';
import { STATIC_ROUTES } from 'utils/routes';

import Registration from './components/RegistrationForm';
import TermsConditions from './components/TermsConditions';

enum Steps {
  LOADING,
  TERMSANDCONDITIONS,
  REGISTRATION,
}

const PersonaRegistration = () => {
  const { personaUserInfo } = usePersona();
  const query = useQueryParams();
  const dispatch = useDispatch();
  const [step, setStep] = useState(Steps.TERMSANDCONDITIONS);
  const { keycloak } = useKeycloak();
  const tokenParsed = keycloak?.tokenParsed as KidsFirstKeycloakTokenParsed;

  useEffect(() => {
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

  if (step === Steps.LOADING || personaUserInfo?.acceptedTerms || !tokenParsed?.sub) {
    return <Spinner size={'large'} />;
  }

  return (
    <>
      <TermsConditions
        isMultiStep
        hidden={step !== Steps.TERMSANDCONDITIONS}
        onFinish={() => {
          trackRegistrationStarted();
          setStep(Steps.REGISTRATION);
        }}
      />

      <Registration
        hidden={step !== Steps.REGISTRATION}
        handleBack={() => setStep(Steps.TERMSANDCONDITIONS)}
        kcToken={tokenParsed}
        onFinishCallback={() => setStep(Steps.LOADING)}
      />
    </>
  );
};

export default PersonaRegistration;
