import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose, lifecycle } from 'recompose';

import Login from 'components/Login/Login';
import SelectRoleForm from 'components/forms/SelectRoleForm';
import ConsentForm from 'components/forms/ConsentForm';
import { withApi } from 'services/api';
import { startAnalyticsTiming, TRACKING_EVENTS } from 'services/analyticsTracking';

import Column from 'uikit/Column';
import Wizard from 'uikit/Wizard';
import { H2 } from 'uikit/Headings';
import { Paragraph } from 'uikit/Core';
import Card from 'uikit/Card';

export const JoinPageHeader = () => (
  <H2
    style={{
      fontSize: '28px',
      lineHeight: 0.87,
      letterSpacing: '0.4px',
      textAlign: 'center',
      marginTop: '25px',
      marginBottom: '35px',
    }}
  >
    Join Kids First Data Resource Portal
  </H2>
);

const JoinH3 = ({ children }) => (
  <h3
    style={{
      fontSize: '16px',
      lineHeight: 1.44,
      letterSpacing: 0,
    }}
  >
    {children}
  </h3>
);

const JoinContent = compose(
  withRouter,
  withApi,
  lifecycle({
    componentDidMount() {
      startAnalyticsTiming(TRACKING_EVENTS.labels.joinProcess);
    },
  }),
)(({ history, api }) => (
  <Column style={{ width: '830px', margin: 'auto' }}>
    <Card showHeader={false}>
      <Wizard
        HeaderComponent={() => <JoinPageHeader />}
        steps={[
          {
            title: 'Connect',
            render: ({ nextStep }) => (
              <Column>
                <JoinH3>Select a way to connect to the Kids First Data Resource Portal</JoinH3>
                <Paragraph style={{ margin: '16px 0' }}>
                  Your information will be kept confidential and secure and is not shared with any
                  of these providers.
                </Paragraph>
                <Login
                  shouldNotRedirect={true}
                  onFinish={user => {
                    if (!user.roles || user.roles.length === 0 || !user.acceptedTerms) {
                      nextStep();
                    } else {
                      history.push('/dashboard');
                    }
                  }}
                />
              </Column>
            ),
            renderButtons: () => <div />,
            canGoBack: true,
          },
          {
            title: 'Basic Info',
            render: ({ disableNextStep, nextStep, prevStep, nextDisabled, prevDisabled }) => (
              <Column>
                <JoinH3>Tell us about yourself</JoinH3>
                <Paragraph style={{ margin: '16px 0' }}>
                  Please provide information about yourself to help us personalize your experience.
                </Paragraph>
                <SelectRoleForm
                  onValidateFinish={errors => disableNextStep(!!Object.keys(errors).length)}
                  onValidChange={isValid => disableNextStep(!isValid)}
                  {...{ nextStep, nextDisabled, prevDisabled, api }}
                />
              </Column>
            ),
            canGoBack: true,
          },
          {
            title: 'Consent',
            render: ({ disableNextStep, nextStep, prevStep, nextDisabled, prevDisabled }) => (
              <ConsentForm
                {...{
                  disableNextStep,
                  nextStep,
                  prevStep,
                  nextDisabled,
                  prevDisabled,
                  history,
                }}
              />
            ),
            canGoBack: false,
          },
        ]}
      />
    </Card>
  </Column>
));

export default JoinContent;
