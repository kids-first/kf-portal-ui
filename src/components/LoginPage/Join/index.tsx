import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Alert, Button, Steps, Typography } from 'antd';
import keycloak from 'keycloak';
import isEmpty from 'lodash/isEmpty';

import { ORCID } from 'common/constants';
import { isFeatureEnabled } from 'common/featuresToggles';
import ROUTES from 'common/routes';
import DeleteButton from 'components/loginButtons/DeleteButton';
import RoleForm, { ROLE_FORM_NAME } from 'components/LoginPage/Join/RoleForm';
import TermsConditionsAcceptButton from 'components/LoginPage/TermsConditions/TermsConditionsAcceptButton';
import TermsConditionsBody from 'components/LoginPage/TermsConditions/TermsConditionsBody';
import SplashPage from 'components/SplashPage';
import useUser from 'hooks/useUser';
import KidsFirstIcon from 'icons/KidsFirstIcon';
import { KidsFirstKeycloakTokenParsed } from 'store/tokenTypes';
import { User } from 'store/userTypes';
import { hasUserRole } from 'utils';

import styles from './index.module.scss';

const { Step } = Steps;

const { Paragraph } = Typography;

interface ILocation {
  from: string;
}

enum JoinSteps {
  LOGIN,
  SELECT_ROLE,
  TERMS,
}

// Avoid showing first step when refreshing from step 1 or 2;
const computeInitialStep = (user: User | null) => {
  if (!user || isEmpty(user)) {
    return JoinSteps.LOGIN;
  }
  if (!hasUserRole(user)) {
    return JoinSteps.SELECT_ROLE;
  }
  return JoinSteps.TERMS;
};

const orcidBanner = () => (
  <Alert
    className={styles.orchidBanner}
    message={'System update notice for ORCID users'}
    description={
      <span>
        We are in the process of updating our login system. As a result, members who use the ORCID
        service are required to re-enter their credentials. This will only be asked of you one time.
        Due to the update you will lose any previously saved queries and saved sets in the Explore
        Data tool. If this affects you, please reach out to our support desk (
        <a href={'mailto:support@kidsfirstdrc.org'} target="_blank" rel="noopener noreferrer">
          support@kidsfirstdrc.org
        </a>
        ) and we will transfer these queries back to your account.
      </span>
    }
    type="warning"
  />
);

const Join = () => {
  const history = useHistory();
  const currentLocation = useLocation();

  const { user, isLoadingUser } = useUser();
  const [current, setNextStep] = useState(computeInitialStep(user));

  useEffect(() => {
    const hasAlreadyJoinedButRoutedToThisPage = user && hasUserRole(user);
    if (hasAlreadyJoinedButRoutedToThisPage) {
      const currentLocationState: ILocation = (currentLocation.state as ILocation) || {
        from: ROUTES.dashboard,
      };
      history.push(user!.acceptedTerms ? currentLocationState.from : ROUTES.termsConditions);
    }
  }, [history, user, currentLocation]);

  const next = () => setNextStep(current + 1);
  const prev = () => setNextStep(current - 1);
  const provider = keycloak.tokenParsed
    ? (keycloak.tokenParsed as KidsFirstKeycloakTokenParsed).identity_provider
    : null;

  const steps = [
    {
      title: 'Connect',
      content: (
        <>
          <Paragraph>
            As a first step you will be asked to choose from one of our connection services.
          </Paragraph>
          <Button
            type={'primary'}
            size={'large'}
            onClick={async () => {
              const url = keycloak.createLoginUrl({
                // eslint-disable-next-line max-len
                redirectUri: `${window.location.origin}/${ROUTES.dashboard}`,
              });
              location.assign(url);
            }}
          >
            {'Select a connection service'}
          </Button>
        </>
      ),
    },
    {
      title: 'Basic Info',
      content: (
        <>
          {isFeatureEnabled('showOrcidBanner') && provider === ORCID && orcidBanner()}
          <RoleForm submitExtraCB={() => next()} />
        </>
      ),
      footer: (
        <div className={styles.stepBasicInfoFooterWrapper}>
          <div>
            <DeleteButton onClickCB={() => prev()} label={'Back'} />
          </div>
          <div>
            <DeleteButton />
            <Button
              loading={isLoadingUser}
              disabled={isLoadingUser}
              className={styles.submitBtn}
              type={'primary'}
              form={ROLE_FORM_NAME}
              key="submit-select-role"
              htmlType="submit"
            >
              Next
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: 'Consent',
      content: <TermsConditionsBody />,
      footer: (
        <div className={styles.stepConsentFooterWrapper}>
          <div>
            <Button onClick={() => prev()}>Back</Button>
          </div>
          <div>
            <DeleteButton />
            <TermsConditionsAcceptButton isNewUser={true} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <SplashPage
      mainTitle=""
      content={
        <>
          <div className={styles.joinHeader}>
            <KidsFirstIcon />
            <h3>Join Kids First Data Resource Portal</h3>
          </div>
          <Steps current={current} size={'small'} className={styles.steps}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className={styles.stepsContent}>{steps[current].content}</div>
        </>
      }
      footerContent={steps[current].footer}
    />
  );
};

export default Join;
