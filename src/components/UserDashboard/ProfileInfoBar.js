import React from 'react';
import { Link } from 'react-router-dom';

import EditButton from './EditButton';
import SettingsButton from './SettingsButton';
import CompletionWrapper from '../UserProfile/CompletionWrapper';
import RoleIconButton from '../RoleIconButton';
import { userProfileBackground } from '../UserProfile';

import Gravtar from 'uikit/Gravatar';
import { H2 } from 'uikit/Headings';

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
    <CompletionWrapper completed={percentageFilled} innerCircleSize="83.18%">
      <Gravtar
        email={loggedInUser.email || ''}
        size={180}
        css={`
          background-color: #fff;
          border: 1px solid #cacbcf;
          width: 100%;
          height: 100%;
        `}
      />
    </CompletionWrapper>

    <RoleIconButton
      css={`
        margin-top: 20px;
        margin-bottom: 43px;
      `}
    >
      <div>
        <span
          css={`
            font-weight: 500;
            margin-left: 30px;
          `}
        >
          {(percentageFilled * 100).toFixed(0)}%
        </span>{' '}
      </div>
    </RoleIconButton>
    <div>
      <H2>
        <Link
          to={`/user/${loggedInUser.egoId}#aboutMe`}
          style={{ color: '#fff' }}
          css={`
            text-decoration: none;
            text-align: center;
            line-height: 1.11;
            letter-spacing: 0.4px;
          `}
        >
          {loggedInUser.title && loggedInUser.title.replace(/^./, m => m.toUpperCase()) + '. '}
          {loggedInUser.firstName} {loggedInUser.lastName}
        </Link>
      </H2>
      {[
        loggedInUser.jobTitle && (
          <span
            css={`
              font-size: 18px;
            `}
          >
            {loggedInUser.jobTitle}
          </span>
        ),
        loggedInUser.institution,
        [loggedInUser.city, loggedInUser.state].filter(Boolean).join(', '),
        loggedInUser.country,
      ]
        .filter(Boolean)
        .map((str, i) => <div key={`${str}${i}`}>{str}</div>)}
      <div
        css={`
          margin: 40px 0 58px;
          text-decoration: underline;
        `}
      >
        {loggedInUser.email}
      </div>
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
