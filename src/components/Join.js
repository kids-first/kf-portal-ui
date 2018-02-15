import React from 'react';
import { injectState } from 'freactal';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
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

const Consent = compose(injectState, withTheme)(
  ({ state: { loggedInUser }, effects: { setUser }, theme }) => (
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
        className={css`
          min-height: 250px;
          width: 90%;
          resize: none;
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
          padding: 5px;
        `}
      >
        <input
          type="checkbox"
          checked={get(loggedInUser, 'acceptedTerms', false)}
          onChange={event => {
            const { email, percentageFilled, ...rest } = loggedInUser;
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
    </div>
  ),
);

const ButtonsDiv = styled('div')`
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-top: solid 1px ${props => props.theme.greyScale4};
  margin-top: 20px;
  padding-top: 20px;
`;

const JoinContent = compose(withRouter, withTheme)(({ history, theme }) => (
  <div
    className={css`
      width: 80%;
      margin: 0px auto;
    `}
  >
    <h2 className={theme.h2}>Join Kids First</h2>
    <div className={theme.card}>
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
                  Don’t worry, the information you provide Kids First will not be shared with any of
                  these providers.
                </p>
                <Login shouldNotRedirect={true} onFinish={nextStep} />
              </div>
            ),
            renderButtons: () => <div />,
            canGoBack: false,
          },
          {
            title: 'Basic Info',
            render: ({ nextStep, disableNextStep }) => (
              <div>
                <h3 className={theme.h3}>A bit about you</h3>
                <p>
                  Please provide a bit about yourself to help us provide you with a personalized
                  experience.
                </p>
                <SelectRoleForm
                  onValidateFinish={errors => disableNextStep(!!Object.keys(errors).length)}
                />
              </div>
            ),
            renderButtons: ({ nextStep, prevStep, nextDisabled, prevDisabled }) => (
              <ButtonsDiv
                className={css`
                  justify-content: flex-end;
                `}
              >
                <DeleteButton className={theme.wizardButton}>Cancel</DeleteButton>
                <button className={theme.wizardButton} onClick={nextStep} disabled={nextDisabled}>
                  Next
                  <RightIcon />
                </button>
              </ButtonsDiv>
            ),
            canGoBack: true,
          },
          {
            title: 'Consent',
            Component: <Consent />,
            renderButtons: ({ nextStep, prevStep, nextDisabled, prevDisabled }) => (
              <ButtonsDiv>
                <button className={theme.wizardButton} onClick={prevStep} disabled={prevDisabled}>
                  <LeftIcon />
                  Back
                </button>
                <div>
                  <button className={theme.wizardButton} onClick={() => history.push('/')}>
                    Cancel
                  </button>
                  <ToSearchPage className={theme.wizardButton} index="file">
                    Finish
                    <RightIcon />
                  </ToSearchPage>
                </div>
              </ButtonsDiv>
            ),
            canGoBack: false,
          },
        ]}
      />
    </div>
  </div>
));
export default JoinContent;
