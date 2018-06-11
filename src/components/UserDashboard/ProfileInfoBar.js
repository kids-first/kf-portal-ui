import React from 'react';
import EditButton from './EditButton';
import ProfileInfoCard from '../../uikit/ProfileInfoCard';
import SettingsButton from './SettingsButton';
import { userProfileBackground } from '../UserProfile/styles';

export default ({ theme, percentageFilled, loggedInUser, profileColors }) => (
  <div
    css={`
      ${theme.column};
      width: 411px;
      ${userProfileBackground(loggedInUser, { showBanner: false, gradientDirection: 'bottom' })};
      box-shadow: ${theme.shadows[0]};
      padding-top: 40px;
      align-content: space-around;
      align-items: center;
      color: ${theme.colors.white};
      font-size: 14px;
      flex: none;
      text-align: center;
    `}
  >
    <ProfileInfoCard
      orientation="vertical"
      profile={loggedInUser}
      theme={theme}
      ProfileProgress={percentageFilled}
      gravatar={{ size: 180 }}
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
