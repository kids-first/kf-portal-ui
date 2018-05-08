import React, { Fragment } from 'react';
import { injectState } from 'freactal';
import { withRouter } from 'react-router-dom';
import { compose, withState } from 'recompose';
import styled, { css } from 'react-emotion';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';
import LeftIcon from 'react-icons/lib/fa/angle-left';
import RightIcon from 'react-icons/lib/fa/angle-right';

import { get } from 'lodash';
import Wizard from 'uikit/Wizard';
import Login from 'components/Login';
import DeleteButton from 'components/loginButtons/DeleteButton';
import SelectRoleForm from 'components/forms/SelectRoleForm';
import { updateProfile } from 'services/profiles';
import ToSearchPage from 'components/links/ToSearchPage';
import { withApi } from 'services/api';
import { withPageViewTracker } from 'services/analyticsTracking';

const Consent = compose(
  injectState,
  withTheme,
  withState('accepted', 'setAccepted', ({ state: { loggedInUser }, disableNextStep }) => {
    const accepted = get(loggedInUser, 'acceptedTerms', false);
    disableNextStep(!accepted);
    return accepted;
  }),
)(
  ({
    state: { loggedInUser },
    effects: { setUser },
    theme,
    disableNextStep,
    accepted,
    setAccepted,
    customStepMessage,
    setCustomStepMessage = () => {},
    api,
  }) => {
    return (
      <div
        className={css`
          ${theme.column} justify-content: space-between;
          align-items: center;
        `}
      >
        <h3
          className={css`
            ${theme.h3} width: 90%;
          `}
        >
          <Trans i18nKey="join.terms.instructions">
            Read and consent to our terms and conditions
          </Trans>
        </h3>
        <div
          css={`
            height: 250px;
            width: 90%;
            overflow-y: scroll;
            ${theme.textarea};
          `}
        >
          <b>
            <Trans i18nKey="join.terms.title">Draft for Demo Purposes</Trans>
          </b>
          <p>
            As a user of the Kids First DRC Portal you agree to the Terms of Service and agree to
            make no attempt to identify or contact individual participants from whom these data were
            collected. Where applicable, you agree to comply with the NIH Code of Conduct for
            Genomic Controlled Access Data Use including, but not limited to:
          </p>
          <ol>
            <li>
              Use of requested datasets solely in connection with the research project described in
              an approved Data Access Request for each dataset;
            </li>
            <li>
              You will not distribute these data to any entity or individual beyond those specified
              in an approved Data Access Request;
            </li>
            <li>
              You will adhere to computer security practices that ensure that only authorized
              individuals can gain access to data files;
            </li>
            <li>
              You will not submit for publication or any other form of public dissemination analyses
              or other reports on work using or referencing NIH datasets prior to an existing
              embargo release date listed for the dataset (or dataset version) on dbGaP;
            </li>
            <li>
              You acknowledge the Intellectual Property Policies as specified in a dataset’s
              associated Data Use Certification; and,
            </li>
            <li>
              You will report any inadvertent data release in accordance with the terms in the Data
              Use Certification, breach of data security, or other data management incidents
              contrary to the terms of data access.
            </li>
          </ol>
        </div>
        <div
          className={css`
            border-radius: 10px;
            background-color: #e5f7fd;
            border: solid 1px ${theme.active};
            width: 90%;
            margin-top: 10px;
            padding: 10px 25px;
          `}
        >
          <input
            type="checkbox"
            checked={accepted}
            onChange={event => {
              const { email, percentageFilled, ...rest } = loggedInUser;
              if (event.target.checked) {
                setCustomStepMessage(null);
              }
              setAccepted(event.target.checked);
              disableNextStep(!event.target.checked);
              updateProfile(api)({
                user: {
                  ...rest,
                  acceptedTerms: event.target.checked,
                },
              }).then(async profile => {
                await setUser({ ...profile, email, api });
              });
            }}
          />
          <Trans i18nKey="join.terms.userAgreement">
            I have read and agreed to the Kids First Data Research Portal Term and Conditions
          </Trans>
        </div>
        {customStepMessage && (
          <div
            className={css`
              color: red;
              width: 90%;
            `}
          >
            {customStepMessage}
          </div>
        )}
      </div>
    );
  },
);

export const ButtonsDiv = styled('div')`
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-top: solid 1px ${props => props.theme.greyScale4};
  margin-top: 20px;
  padding-top: 20px;
`;

const JoinContent = compose(injectState, withRouter, withTheme, withPageViewTracker, withApi)(
  ({ state: { loggedInUser }, effects: { setToast, closeToast }, history, theme, api }) => (
    <div
      className={css`
        width: 830px;
        margin: auto;
      `}
    >
      <div className={theme.card}>
        <h2 className={theme.h2}>
          <Trans>Join Kids First</Trans>
        </h2>
        <Wizard
          steps={[
            {
              title: 'Connect',
              render: ({ nextStep }) => (
                <div>
                  <h3 className={theme.h3}>
                    <Trans i18nKey="join.wizard.socialSelect">
                      Select a way to connect to the Kids First Data Resource Portal
                    </Trans>
                  </h3>
                  <p>
                    <Trans i18nKey="join.wizard.dataConfidentiality">
                      Your information will be kept confidential and secure and is not shared with
                      any of these providers.
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
                <div>
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
              render: ({
                disableNextStep,
                customStepMessage,
                setCustomStepMessage,
                nextStep,
                prevStep,
                nextDisabled,
                prevDisabled,
              }) => (
                <Fragment>
                  <Consent
                    {...{
                      api,
                      disableNextStep,
                      customStepMessage,
                      setCustomStepMessage,
                    }}
                  />
                  <ButtonsDiv>
                    <button
                      className={theme.wizardButton}
                      onClick={prevStep}
                      disabled={prevDisabled}
                    >
                      <LeftIcon />
                      <Trans>Back</Trans>
                    </button>
                    <div className={theme.row}>
                      <DeleteButton api={api} className={theme.wizardButton}>
                        <Trans>Cancel</Trans>
                      </DeleteButton>
                      <button
                        className={theme.actionButton}
                        onClick={() => {
                          if (!nextDisabled) {
                            setToast({
                              id: `${Date.now()}`,
                              action: 'success',
                              component: (
                                <div>
                                  <Trans i18nKey="join.wizard.profileOrBrowse">
                                    Fill out your profile, or skip and
                                    <ToSearchPage
                                      index="file"
                                      onClick={function() {
                                        //using 'function' so that we don't break Trans parsing
                                        closeToast();
                                      }}
                                    >
                                      browse data
                                    </ToSearchPage>
                                  </Trans>
                                </div>
                              ),
                            });
                            history.push(`/user/${loggedInUser.egoId}`);
                          } else {
                            setCustomStepMessage('You must accept terms to continue');
                          }
                        }}
                      >
                        <Trans>Save</Trans>
                        <RightIcon />
                      </button>
                    </div>
                  </ButtonsDiv>
                </Fragment>
              ),
              canGoBack: false,
            },
          ]}
        />
      </div>
    </div>
  ),
);
export default JoinContent;
