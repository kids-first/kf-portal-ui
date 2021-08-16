import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Steps, Typography } from 'antd';
import isEmpty from 'lodash/isEmpty';

import { User } from 'store/userTypes';
import { hasUserRole } from 'utils';

import ROUTES from '../../common/routes';
import useUser from '../../hooks/useUser';
import DeleteButton from '../loginButtons/DeleteButton';
import SplashPage from '../SplashPage';

import Login from './Login';
import RoleForm, { ROLE_FORM_NAME } from './RoleForm';
import TermsConditionsAcceptButton from './TermsConditionsAcceptButton';
import TermsConditionsBody from './TermsConditionsBody';

import './join.css';

const { Step } = Steps;

const { Paragraph, Title } = Typography;

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
  const { user, isLoadingUser } = useUser();
  const [current, setNextStep] = useState(computeInitialStep(user));

  useEffect(() => {
    const hasAlreadyJoinedButRoutedToThisPage = user && hasUserRole(user);
    if (hasAlreadyJoinedButRoutedToThisPage) {
      history.push(user!.acceptedTerms ? ROUTES.dashboard : ROUTES.termsConditions);
    }
  }, [history, user]);

  const next = () => setNextStep(current + 1);
  const prev = () => setNextStep(current - 1);

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
          <Login shouldNotRedirect={true} />
        </>
      ),
    },
    {
      title: 'Basic Info',
      content: (
        <>
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
