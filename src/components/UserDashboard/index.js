import * as React from 'react';
import { compose, branch, renderComponent } from 'recompose';
import { withRouter } from 'react-router-dom';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import MySavedQueries from './MySavedQueries';
import Notifications from './Notifications';
import Integrations from './Integrations';
import ProfileInfoBar from './ProfileInfoBar';
import { StyledH2 } from './styles';

export default compose(
  injectState,
  withRouter,
  withTheme,
  branch(({ state: { loggedInUser } }) => !loggedInUser, renderComponent(() => <div />)),
)(({ state: { loggedInUser, integrationTokens, percentageFilled }, theme }) => (
  <div
    css={`
      ${theme.row};
      height: calc(100% - 170px);
    `}
  >
    <ProfileInfoBar theme={theme} percentageFilled={percentageFilled} loggedInUser={loggedInUser} />
    <div
      css={`
        ${theme.column};
        flex-grow: 1;
        padding: 40px;
      `}
    >
      <StyledH2>Welcome back, {loggedInUser.firstName}!</StyledH2>
      <div
        css={`
          display: flex;
        `}
      >
        <MySavedQueries />
        <Notifications />
      </div>
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
  </div>
));
