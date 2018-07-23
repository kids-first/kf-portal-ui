import * as React from 'react';
import { compose, branch, renderComponent } from 'recompose';
import { withRouter } from 'react-router-dom';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import { Helmet } from 'react-helmet';
import styled from 'react-emotion';

import { ROLES } from 'common/constants';
import MySavedQueries from './MySavedQueries';
import Notifications from './Notifications';
import Integrations from './Integrations';
import ProfileInfoBar from './ProfileInfoBar';
import { H2 } from './styles';
import Column from 'uikit/Column';
import {
  PromptMessageContainer,
  PromptMessageHeading,
  PromptMessageContent,
} from 'uikit/PromptMessage';
import ExternalLink from 'uikit/ExternalLink';

const UserDashboard = styled('div')`
  ${({ theme }) => theme.row};
  min-height: 600px;
`;

export default compose(
  injectState,
  withRouter,
  withTheme,
  branch(({ state: { loggedInUser } }) => !loggedInUser, renderComponent(() => <div />)),
)(({ state: { loggedInUser, integrationTokens, percentageFilled }, theme, api }) => {
  const profileColors = ROLES.reduce(
    (prev, curr) => (curr.type === loggedInUser.roles[0] ? curr.profileColors : prev),
    ROLES[0].profileColors,
  );

  return (
    <UserDashboard>
      <Helmet>
        <title>Portal - User Dashboard</title>
      </Helmet>

      <ProfileInfoBar
        theme={theme}
        percentageFilled={percentageFilled}
        loggedInUser={loggedInUser}
        profileColors={profileColors}
      />
      <div
        css={`
          ${theme.column};
          flex-grow: 1;
          padding: 40px;
        `}
      >
        <H2>Welcome, {loggedInUser.firstName}!</H2>
        <Column>
          <PromptMessageContainer info mt={20} mb={20} p={20}>
            <PromptMessageHeading info mb={20}>
              The Portal is currently in <strong>BETA Phase</strong>
            </PromptMessageHeading>
            <PromptMessageContent>
              We are actively working on features, so you might find that your data has changed,
              such as your saved queries. Data in the repository will change regularly, such as
              field names or the amount of data available. We appreciate your usage and feedback
              during this phase, so please keep visiting and if you have any questions contact us
              at:{' '}
              <ExternalLink hasExternalIcon={false} href="support@kidsfirstdrc.org">
                <strong>support@kidsfirstdrc.org</strong>
              </ExternalLink>.
            </PromptMessageContent>
          </PromptMessageContainer>
          <div
            css={`
              display: flex;
              overflow: hidden;
            `}
          >
            <MySavedQueries {...{ api, loggedInUser, theme, profileColors }} />
            <Notifications />
          </div>
        </Column>
        <div
          css={`
            margin-top: auto;
          `}
        >
          <Integrations
            integrationTokens={integrationTokens}
            theme={theme}
            loggedInUser={loggedInUser}
          />
        </div>
      </div>
    </UserDashboard>
  );
});
