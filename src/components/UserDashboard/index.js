import * as React from 'react';
import { compose, branch, renderComponent } from 'recompose';
import { withRouter } from 'react-router-dom';
import { injectState } from 'freactal';
import { get } from 'lodash';
import { withTheme } from 'emotion-theming';
import { ROLES } from 'common/constants';
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
)(({ state: { loggedInUser, integrationTokens, percentageFilled }, theme }) => {
  const profileColors = ROLES.reduce(
    (prev, curr) => (curr.type == loggedInUser.roles[0] ? curr.profileColors : prev),
    ROLES[0].profileColors,
  );

  return (
    <div
      css={`
        ${theme.row};
        height: calc(100% - 170px);
      `}
    >
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
        <StyledH2>Welcome, {loggedInUser.firstName}!</StyledH2>
        <div
          css={`
            display: flex;
          `}
        >
          <MySavedQueries loggedInUser={loggedInUser} theme={theme} profileColors={profileColors} />
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
  );
});
