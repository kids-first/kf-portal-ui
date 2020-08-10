/* eslint-disable react/prop-types */
import React, { FunctionComponent, useState } from 'react';
import { Steps, Button, Typography } from 'antd';
import SplashPage from '../SplashPage';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Login from './Login';
import { LoggedInUser } from 'store/userTypes';
import './join.css';
// @ts-ignore
import { compose } from 'recompose';
import TermsConditionsAcceptButton from './TermsConditionsAcceptButton';
import DeleteButton from '../loginButtons/DeleteButton';
import TermsConditionsBody from './TermsConditionsBody';
import RoleForm, { ROLE_FORM_NAME } from './RoleForm';
import isEmpty from 'lodash/isEmpty';
import { InjectStateProps } from 'store/freactalStateTypes';
// @ts-ignore
import { injectState } from 'freactal';
import ROUTES from 'common/routes';
import { hasUserRole } from 'utils';

const { Step } = Steps;

const { Paragraph, Title } = Typography;

type Props = RouteComponentProps & InjectStateProps;

const LOGIN_STEP = 0;
const SELECT_ROLE_STEP = 1;
const TERMS_STEP = 2;
// Avoid showing first step when refreshing from step 1 or 2;
const computeInitialStep = (user: LoggedInUser) => {
  if (!user || isEmpty(user)) {
    return LOGIN_STEP;
  }
  if (!hasUserRole(user)) {
    return SELECT_ROLE_STEP;
  }
  return TERMS_STEP;
};

const Join: FunctionComponent<Props> = ({ history, state: { loggedInUser } }) => {
  const [current, setNextStep] = useState(computeInitialStep(loggedInUser));
  //FIXME replace with redux props when freactal is removed
  const [isSubmittingRoleForm, setIsSubmittingRoleForm] = useState(false);
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
          <Login
            shouldNotRedirect={true}
            onFinish={(user: LoggedInUser) => {
              const showForm = !hasUserRole(user);
              if (showForm) {
                next();
              } else {
                history.push(ROUTES.termsConditions);
              }
            }}
          />
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
          <RoleForm
            submitExtraCB={() => next()}
            setIsSubmittingRoleFormCB={setIsSubmittingRoleForm}
          />
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
              loading={isSubmittingRoleForm}
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
            <TermsConditionsAcceptButton isNewUser={true} type={'primary'} />
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

export default compose(injectState, withRouter)(Join);
