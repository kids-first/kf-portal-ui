import * as React from 'react';
import { compose, branch, renderComponent } from 'recompose';
import { withRouter } from 'react-router-dom';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import { Helmet } from 'react-helmet';
import styled from 'react-emotion';

import { ROLES } from 'common/constants';
import MySavedQueries from './MySavedQueries';
import Integrations from './Integrations';
import ProfileInfoBar from './ProfileInfoBar';
import Row from 'uikit/Row';
import { H1 } from '../../uikit/Headings';
import TwitterBlock from './TwitterBlock';

const UserDashboard = styled('div')`
  ${({ theme }) => theme.row};
  width: 100%;
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
        <H1 mb={'35px' /* On removing Beta Message change to 44px */}>
          Welcome, {loggedInUser.firstName}!
        </H1>
        <Row>
          <MySavedQueries {...{ api, loggedInUser, theme, profileColors }} />
          <TwitterBlock handle="kidsfirstDRC" />ature/twitter block (#805)
        </Row>
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
