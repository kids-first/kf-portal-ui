import React from 'react';
import Gravtar from 'uikit/Gravatar';
import { Link } from 'react-router-dom';
import EditButton from './EditButton';

import SettingsButton from './SettingsButton';
import CompletionWrapper from '../UserProfile/CompletionWrapper';
import RoleIconButton from '../RoleIconButton';

export default ({ theme, percentageFilled, loggedInUser, profileColors }) => (
  <div
    className={`${theme.column} profileInfoBar`}
    css={`
      background-image: linear-gradient(
        to bottom,
        ${profileColors.gradientDark} 33%,
        ${profileColors.gradientMid} 66%,
        ${profileColors.gradientLight}
      );
    `}
  >
    <CompletionWrapper completed={percentageFilled} innerCircleSize="83.18%">
      <Gravtar className={`gravatar`} email={loggedInUser.email || ''} size={180} />
    </CompletionWrapper>

    <RoleIconButton className={`roleIconButton`}>
      <span>{`${(percentageFilled * 100).toFixed(0)}% Complete`}</span>
    </RoleIconButton>
    <div>
      <Link to={`/user/${loggedInUser.egoId}#aboutMe`} className={`userFullName`}>
        {loggedInUser.title && loggedInUser.title.replace(/^./, m => m.toUpperCase()) + '. '}
        {loggedInUser.firstName} {loggedInUser.lastName}
      </Link>
      {[
        loggedInUser.jobTitle && <span className={`jobTitle`}>{loggedInUser.jobTitle}</span>,
        loggedInUser.institution,
        [loggedInUser.city, loggedInUser.state].filter(Boolean).join(', '),
        loggedInUser.country,
      ]
        .filter(Boolean)
        .map((str, i) => <div key={`${str}${i}`}>{str}</div>)}
      <div className={`email`}>{loggedInUser.email}</div>
    </div>
    <div
      css={`
        display: flex;
      `}
    >
      <EditButton egoId={loggedInUser.egoId} theme={theme} />
      <SettingsButton egoId={loggedInUser.egoId} theme={theme} />
    </div>
  </div>
);
