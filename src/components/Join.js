import React, { Fragment } from 'react';
import { injectState } from 'freactal';
import { withRouter } from 'react-router-dom';
import { compose, lifecycle } from 'recompose';
import { css } from 'emotion';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';

import Login from 'components/Login';
import SelectRoleForm from 'components/forms/SelectRoleForm';
import ConsentForm from 'components/forms/ConsentForm';
import { withApi } from 'services/api';
import { startAnalyticsTiming, TRACKING_EVENTS } from 'services/analyticsTracking';

import { ExternalLink } from 'uikit/Core';
import Column from 'uikit/Column';
import Wizard from 'uikit/Wizard';
import FlashMessage from 'uikit/FlashMessage';

export const ButtonsDiv = styled('div')`
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-top: solid 1px ${props => props.theme.greyScale4};
  padding-top: 20px;
  min-height: 60px;
  background: ${({ theme }) => theme.white};
`;

const JoinContainer = styled(Column)`
  width: 830px;
  margin: auto;
`;

export const JoinPageHeader = withTheme(({ theme }) => (
  <Fragment>
    <h2 className={theme.h2}>
      <Trans>Join Kids First Data Resource Portal</Trans>
    </h2>
    <FlashMessage mb={4}>
      <Trans>
        We're currently in <b>beta phase</b> for the Kids First DRP. We're looking for your input so
        we can build a data portal that better meets your needs. Please send us your feedback or any
        other issues you experience at:{' '}
        <ExternalLink bare primary bold href="mailto:support@kidsfirst.org">
          support@kidsfirst.org
        </ExternalLink>
      </Trans>
    </FlashMessage>
  </Fragment>
));

const JoinContent = compose(
  injectState,
  withRouter,
  withTheme,
  withApi,
  lifecycle({
    componentDidMount() {
      startAnalyticsTiming(TRACKING_EVENTS.labels.joinProcess);
    },
  }),
)(({ state: { loggedInUser }, effects: { setToast, closeToast }, history, theme, api }) => (
  <JoinContainer>
    <Column className={`${theme.card}`}>
      <Wizard
        HeaderComponent={() => <JoinPageHeader />}
        steps={[
          {
            title: 'Connect',
            render: ({ nextStep }) => (
              <div className={theme.column}>
                <h3 className={theme.h3}>
                  <Trans i18nKey="join.wizard.socialSelect">
                    Select a way to connect to the Kids First Data Resource Portal
                  </Trans>
                </h3>
                <p>
                  <Trans i18nKey="join.wizard.dataConfidentiality">
                    Your information will be kept confidential and secure and is not shared with any
                    of these providers.
                  </Trans>
                </p>
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
              </div>
            ),
            renderButtons: () => <div />,
            canGoBack: true,
          },
          {
            title: 'Basic Info',
            render: ({ disableNextStep, nextStep, prevStep, nextDisabled, prevDisabled }) => (
              <div className={theme.column}>
                <h3 className={theme.h3}>
                  <Trans i18nKey="join.wizard.basicInfoHeader">Tell us about yourself</Trans>
                </h3>
                <p>
                  <Trans i18nKey="join.wizard.basicInfoInstructions">
                    Please provide information about yourself to help us personalize your
                    experience.
                  </Trans>
                </p>
                <SelectRoleForm
                  onValidateFinish={errors => disableNextStep(!!Object.keys(errors).length)}
                  onValidChange={isValid => disableNextStep(!isValid)}
                  {...{ nextStep, nextDisabled, prevDisabled, api }}
                />
              </div>
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
    </Column>
  </JoinContainer>
));

export default JoinContent;
