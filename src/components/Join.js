import React from 'react';
import { injectState } from 'freactal';
import { withRouter } from 'react-router-dom';
import { compose, withState } from 'recompose';
import styled, { css } from 'react-emotion';
import { withTheme } from 'emotion-theming';
import LeftIcon from 'react-icons/lib/fa/angle-left';
import RightIcon from 'react-icons/lib/fa/angle-right';

import { get } from 'lodash';
import Wizard from 'uikit/Wizard';
import Login from 'components/Login';
import DeleteButton from 'components/loginButtons/DeleteButton';
import SelectRoleForm from 'components/forms/SelectRoleForm';
import { updateProfile } from 'services/profiles';
import ToSearchPage from 'components/links/ToSearchPage';

const Consent = compose(
  injectState,
  withTheme,
  withState('touched', 'setTouched', false),
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
    touched,
    setTouched,
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
          Read and consent to our terms and conditions
        </h3>
        <textarea
          css={`
            ${theme.textarea};
            min-height: 250px;
            width: 90%;
          `}
          value="Lollipop halvah cotton candy marshmallow gingerbread jelly beans topping. Fruitcake
            sugar plum tiramisu pie. Sugar plum sweet roll cake chocolate bar lollipop jelly
            beans. Jelly jelly beans icing macaroon tart jujubes lemon drops marzipan. Liquorice
            carrot cake bonbon pie chocolate. Gingerbread oat cake tootsie roll icing. Chocolate
            muffin danish croissant. Carrot cake bonbon bonbon lemon drops caramels danish
            tootsie roll. Biscuit jelly beans sugar plum. Sweet danish oat cake carrot cake
            chocolate bar marshmallow croissant. Ice cream chocolate gummies fruitcake. Marzipan
            brownie chocolate bar tart. Oat cake apple pie soufflé topping. Toffee dessert
            chocolate cotton candy carrot cake topping fruitcake gummi bears. Chocolate cake
            brownie pie cake caramels."
          readOnly
        />
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
              setAccepted(event.target.checked);
              disableNextStep(!event.target.checked);
              setTouched(true);
              updateProfile({
                user: {
                  ...rest,
                  acceptedTerms: event.target.checked,
                },
              }).then(async profile => {
                await setUser({ ...profile, email });
              });
            }}
          />
          I have read and agreed to the Kids First Data Research Portal Term and Conditions
        </div>
        {touched &&
          !accepted && (
            <div
              className={css`
                color: red;
                width: 90%;
              `}
            >
              You must accept terms to continue
            </div>
          )}
      </div>
    );
  },
);

const ButtonsDiv = styled('div')`
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-top: solid 1px ${props => props.theme.greyScale4};
  margin-top: 20px;
  padding-top: 20px;
`;

const JoinContent = compose(injectState, withRouter, withTheme)(
  ({ state: { loggedInUser }, effects: { setToast, closeToast }, history, theme }) => (
    <div
      className={css`
        width: 830px;
        margin: auto;
      `}
    >
      <div className={theme.card}>
        <h2 className={theme.h2}>Join Kids First</h2>
        <Wizard
          steps={[
            {
              title: 'Connect',
              render: ({ nextStep }) => (
                <div>
                  <h3 className={theme.h3}>
                    Select a way to connect to the Kids First Data Resource Portal
                  </h3>
                  <p>
                    Your information will be kept confidential and secure and is not shared with any
                    of these providers.
                  </p>
                  <Login
                    shouldNotRedirect={true}
                    onFinish={user => {
                      if (!user.roles || user.roles.length === 0 || !user.acceptedTerms) {
                        nextStep();
                      } else {
                        history.push('/search/file');
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
              render: ({ nextStep, disableNextStep }) => (
                <div>
                  <h3 className={theme.h3}>Tell us about yourself</h3>
                  <p>
                    Please provide information about yourself to help us personalize your
                    experience.
                  </p>
                  <SelectRoleForm
                    onValidateFinish={errors => disableNextStep(!!Object.keys(errors).length)}
                    onValidChange={isValid => disableNextStep(!isValid)}
                  />
                </div>
              ),
              renderButtons: ({ nextStep, prevStep, nextDisabled, prevDisabled }) => (
                <ButtonsDiv>
                  <DeleteButton className={theme.wizardButton} disabled={prevDisabled}>
                    <LeftIcon />
                    Back
                  </DeleteButton>
                  <div className={theme.row}>
                    <DeleteButton
                      css={`
                        ${theme.wizardButton} font-weight: 300;
                      `}
                    >
                      Cancel
                    </DeleteButton>
                    <button
                      className={theme.actionButton}
                      onClick={nextStep}
                      disabled={nextDisabled}
                    >
                      Next
                      <RightIcon />
                    </button>
                  </div>
                </ButtonsDiv>
              ),
              canGoBack: true,
            },
            {
              title: 'Consent',
              render: ({ disableNextStep }) => <Consent disableNextStep={disableNextStep} />,
              renderButtons: ({ nextStep, prevStep, nextDisabled, prevDisabled }) => (
                <ButtonsDiv>
                  <button className={theme.wizardButton} onClick={prevStep} disabled={prevDisabled}>
                    <LeftIcon />
                    Back
                  </button>
                  <div className={theme.row}>
                    <DeleteButton className={theme.wizardButton}>Cancel</DeleteButton>
                    <button
                      className={theme.actionButton}
                      onClick={() => {
                        if (!nextDisabled) {
                          setToast({
                            id: `${Date.now()}`,
                            action: 'success',
                            component: (
                              <div>
                                Fill out your profile, or skip and{' '}
                                <ToSearchPage index="file" onClick={() => closeToast()}>
                                  browse data
                                </ToSearchPage>
                              </div>
                            ),
                          });
                          history.push(`/user/${loggedInUser.egoId}`);
                        }
                      }}
                      disabled={nextDisabled}
                    >
                      Save
                      <RightIcon />
                    </button>
                  </div>
                </ButtonsDiv>
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
