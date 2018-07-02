import React from 'react';
import EditButton from './EditButton';
import SettingsButton from './SettingsButton';
import ProfileInfoCard from '../../uikit/ProfileInfoCard';
import { userProfileBackground } from '../UserProfile';

export default ({ theme, percentageFilled, loggedInUser, profileColors }) => (
  <div
    css={`
      ${theme.column};
      width: 411px;
      ${userProfileBackground(loggedInUser, { showBanner: false, gradientDirection: 'bottom' })};
      box-shadow: 0 0 4.8px 0.2px #a0a0a3;
      padding-top: 40px;
      align-content: space-around;
      align-items: center;
      color: #fff;
      font-size: 14px;
      flex: none;
      text-align: center;
    `}
  >
    <ProfileInfoCard
      orientation="vertical"
      profile={loggedInUser}
      ProfileProgress={percentageFilled}
      gravatar={{ size: 180 }}
      theme={theme}
      RoleIconButtonInner={() => (
        <div>
          <span
            css={`
              font-weight: 500;
            `}
          >
            {(percentageFilled * 100).toFixed(0)}%
          </span>{' '}
          Complete
        </div>
      )}
      buttons={({ profile }) => (
        <div
          css={`
            display: flex;
            justify-content: space-around;
            margin: 40px 0 0 0;
          `}
        >
          <EditButton egoId={loggedInUser.egoId} theme={theme} />
          <SettingsButton egoId={loggedInUser.egoId} theme={theme} />
        </div>
      )}
    />
  </div>
);
