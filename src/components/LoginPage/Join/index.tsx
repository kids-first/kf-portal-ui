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
import { KidsFirstKeycloakTokenParsed } from 'store/tokenTypes';
import { User } from 'store/userTypes';
import { hasUserRole } from 'utils';

import './index.css';

const { Step } = Steps;

const { Paragraph, Title } = Typography;

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
          <Title level={4}>Select a way to connect to the Kids First Data Resource Portal</Title>
          <Paragraph>
            Your information will be kept confidential and secure and is not shared with any of
            these providers.
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
            {'Log in'}
          </Button>
        </>
      ),
    },
    {
      title: 'Basic Info',
      content: (
        <>
          {isFeatureEnabled('showOrcidBanner') && provider === ORCID && (
            <Alert
              message={
                'For ORCID user, if you want to recover your account, contact support with your ORCID ID'
              }
              type="warning"
            />
          )}
          <Paragraph className={'step-basic-info-paragraph'}>
            Please provide information about yourself to help us personalize your experience.
          </Paragraph>
          <RoleForm submitExtraCB={() => next()} />
        </>
      ),
      footer: (
        <div className={'step-basic-info-footer-wrapper'}>
          <div>
            <DeleteButton onClickCB={() => prev()} label={'Back'} />
          </div>
          <div>
            <DeleteButton />
            <Button
              loading={isLoadingUser}
              disabled={isLoadingUser}
              className={'submit-btn'}
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
        <div className={'step-consent-footer-wrapper'}>
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
      mainTitle={'Join Kids First Data Resource Portal'}
      content={
        <>
          <Steps current={current} size={'small'}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content">{steps[current].content}</div>
        </>
      }
      footerContent={steps[current].footer}
    />
  );
};

export default Join;
