import React from 'react';
import Gravtar from 'uikit/Gravatar';
import { Link } from 'react-router-dom';
import EditButton from './EditButton';

import SettingsButton from './SettingsButton';
import CompletionWrapper from '../UserProfile/CompletionWrapper';
import RoleIconButton from '../RoleIconButton';
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
      color: ${theme.white};
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
        width: 290px;
      `}
    >
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
    </RoleIconButton>
    <div css={`${theme.text.center}`}>
      <h2 
        css={`
          ${theme.h2}
          font-weight: 500;
          margin: 0;
        `}
      >
      <Link
        to={`/user/${loggedInUser.egoId}#aboutMe`}
        css={`
          color: ${theme.white};
          text-decoration: none;
          &:hover {
            text-decoration: underline;
          }
        `}
      >
        {loggedInUser.title && loggedInUser.title.replace(/^./, m => m.toUpperCase()) + '. '}
        {loggedInUser.firstName} {loggedInUser.lastName}
      </Link>
      </h2>
      {[
        loggedInUser.jobTitle && (
           <h2
              css={`
                ${theme.spacing.collapse}
                ${theme.h2}
                color: ${theme.white};
                ${theme.spacing.collapse}
              `}
            >
              <small css={`${theme.text.small} font-weight: 300;`}>{loggedInUser.jobTitle}</small>
          </h2>
        ),
        loggedInUser.institution,
        [loggedInUser.city, loggedInUser.state].filter(Boolean).join(', '),
        loggedInUser.country,
      ]
        .filter(Boolean)
        .map((str, i) => <p css={`${theme.paragraph} ${theme.spacing.collapse} color: ${theme.white}; margin-top:0; line-height: 1.33;`} key={`${str}${i}`}>{str}</p>)}
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
