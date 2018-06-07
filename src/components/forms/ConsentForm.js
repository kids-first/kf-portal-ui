import React, { Fragment } from 'react';
import { injectState } from 'freactal';
import { compose, withState } from 'recompose';
import styled from 'react-emotion';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';
import LeftIcon from 'react-icons/lib/fa/angle-left';
import RightIcon from 'react-icons/lib/fa/angle-right';
import { get } from 'lodash';

import DeleteButton from 'components/loginButtons/DeleteButton';
import { updateProfile } from 'services/profiles';
import { Link } from 'react-router-dom';
import { withApi } from 'services/api';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { ButtonsDiv } from 'components/Join';
import { personaApiRoot } from 'common/injectGlobals';

import CheckboxBubble from 'uikit/CheckboxBubble';
import Column from 'uikit/Column';
import TextArea from 'uikit/TextArea';

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
        <h3 className={theme.h3}>
          <Trans i18nKey="join.terms.instructions">
            Read and consent to our terms and conditions
          </Trans>
        </h3>
        <Terms>
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

const subscribeUser = api => ({ loggedInUser }) =>
  api({
    url: `${personaApiRoot}/subscribe`,
    body: {
      user: loggedInUser,
    },
  });

export default compose(injectState, withTheme, withApi)(
  ({
    state: { loggedInUser },
    effects: { setToast, closeModal, closeToast },
    api,
    theme,
    nextDisabled,
    history,
    disableNextStep,
    nextStep,
    prevStep,
    prevDisabled,
  }) => (
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
            className={theme.actionButton}
            onClick={() => {
              subscribeUser(api)({ loggedInUser });
              if (!nextDisabled) {
                setToast({
                  id: `${Date.now()}`,
                  action: 'success',
                  component: (
                    <div>
                      <Trans i18nKey="join.wizard.profileOrBrowse">
                        Fill out your profile, or skip and
                        <Link
                          to={`/search/file`}
                          onClick={function() {
                            //using 'function' so that we don't break Trans parsing
                            closeToast();
                          }}
                        >
                          browse data
                        </Link>
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
);
