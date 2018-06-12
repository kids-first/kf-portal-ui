import React, { Fragment } from 'react';
import { injectState } from 'freactal';
import { withRouter } from 'react-router-dom';
import { compose, withState, lifecycle } from 'recompose';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';
import LeftIcon from 'react-icons/lib/fa/angle-left';
import RightIcon from 'react-icons/lib/fa/angle-right';
import { get } from 'lodash';

import Login from 'components/Login';
import DeleteButton from 'components/loginButtons/DeleteButton';
import SelectRoleForm from 'components/forms/SelectRoleForm';
import { updateProfile } from 'services/profiles';
import ToSearchPage from 'components/links/ToSearchPage';
import { withApi } from 'services/api';
import {
  trackUserInteraction,
  startAnalyticsTiming,
  TRACKING_EVENTS,
} from 'services/analyticsTracking';

import CheckboxBubble from 'uikit/CheckboxBubble';
import Column from 'uikit/Column';
import TextArea from 'uikit/TextArea';
import Wizard from 'uikit/Wizard';
import { H2, H3, P } from 'uikit/Typography';

const ConsentContainer = styled(Column)`
  justify-content: space-between;
  align-items: center;
`;

const Terms = styled(TextArea)`
  height: 250px;
  overflow-y: scroll;
`;

const Label = styled('label')`
  margin-left: 10px;
  font-size: 14px;
`;

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
    api,
  }) => {
    return (
      <ConsentContainer>
        <H3>
          <Trans i18nKey="join.terms.instructions">
            Read and consent to our terms and conditions
          </Trans>
        </H3>
        <Terms>
          <b>
            <Trans i18nKey="join.terms.title">Draft for Demo Purposes</Trans>
          </b>
          <P>
            As a user of the Kids First DRC Portal you agree to the Terms of Service and agree to
            make no attempt to identify or contact individual participants from whom these data were
            collected. Where applicable, you agree to comply with the NIH Code of Conduct for
            Genomic Controlled Access Data Use including, but not limited to:
          </P>
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
        </Terms>
        <CheckboxBubble
          buffer
          onClick={active => {
            const { email, percentageFilled, ...rest } = loggedInUser;
            if (active) {
              trackUserInteraction({
                category: TRACKING_EVENTS.categories.join,
                action: TRACKING_EVENTS.actions.acceptedTerms,
                label: TRACKING_EVENTS.labels.joinProcess,
              });
            }
            setAccepted(active);
            disableNextStep(!active);
            updateProfile(api)({
              user: {
                ...rest,
                acceptedTerms: active,
              },
            }).then(async profile => {
              await setUser({ ...profile, email, api });
            });
          }}
        >
          <input type="checkbox" checked={accepted} />
          <Label>
            <Trans i18nKey="join.terms.userAgreement">
              I have read and agreed to the Kids First Data Research Portal Term and Conditions
            </Trans>
          </Label>
        </CheckboxBubble>
      </ConsentContainer>
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
  min-height: 38px;
`;

const JoinContainer = styled(Column)`
  width: 830px;
  margin: auto;
  max-height: 90%;
`;

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
    <div className={`${theme.card} ${theme.column} `}>
      <H2 textAlign="center">
        <Trans>Join Kids First</Trans>
      </H2>
      <Wizard
        steps={[
          {
            title: 'Connect',
            render: ({ nextStep }) => (
              <div className={theme.column}>
                <H3 mb="0" textAlign="center">
                  <Trans i18nKey="join.wizard.socialSelect">
                    Select a way to connect to the Kids First Data Resource Portal
                  </Trans>
                </H3>
                <P textAlign="center">
                  <Trans i18nKey="join.wizard.dataConfidentiality">
                    Your information will be kept confidential and secure and is not shared with any
                    of these providers.
                  </Trans>
                </P>
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
                <H3 mb="0">
                  <Trans i18nKey="join.wizard.basicInfoHeader">Tell us about yourself</Trans>
                </H3>
                <P mt="10px" mb="20px">
                  <Trans i18nKey="join.wizard.basicInfoInstructions">
                    Please provide information about yourself to help us personalize your
                    experience.
                  </Trans>
                </P>
                <SelectRoleForm
                  css={`
                    margin-top: 10px;
                  `}
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
              <Fragment>
                <Consent
                  {...{
                    api,
                    disableNextStep,
                  }}
                />
                <ButtonsDiv>
                  <button className={theme.wizardButton} onClick={prevStep} disabled={prevDisabled}>
                    <LeftIcon />
                    <Trans>Back</Trans>
                  </button>
                  <div className={theme.row}>
                    <DeleteButton api={api} className={theme.wizardButton}>
                      <Trans>Cancel</Trans>
                    </DeleteButton>
                    <button
                      disabled={nextDisabled}
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
                          trackUserInteraction({
                            category: TRACKING_EVENTS.categories.join,
                            action: TRACKING_EVENTS.actions.signedUp,
                            label: `Join Completion: egoId ${loggedInUser.egoId}`,
                          });
                          history.push(`/user/${loggedInUser.egoId}`);
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
  </JoinContainer>
));
export default JoinContent;
