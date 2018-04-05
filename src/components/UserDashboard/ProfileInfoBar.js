import React from 'react';
import Gravtar from 'uikit/Gravatar';
import { Link } from 'react-router-dom';
import EditButton from './EditButton';

import SettingsButton from './SettingsButton';
import CompletionWrapper from '../UserProfile/CompletionWrapper';
import RoleIconButton from '../RoleIconButton';

export default ({ theme, percentageFilled, loggedInUser }) => (
  <div
    css={`
      ${theme.column};
      width: 411px;
      background-image: linear-gradient(rgba(64, 76, 154, 0.25), rgba(64, 76, 154, 0.25)),
        linear-gradient(to bottom, #1d78b9, #009bb8 52%, #02b0ed);
      box-shadow: 0 0 4.8px 0.2px #a0a0a3;
      padding-top: 40px;
      align-content: space-around;
      align-items: center;
      color: #fff;
      font-family: Montserrat;
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
    <div>
      <Link
        to={`/user/${loggedInUser.egoId}#aboutMe`}
        css={`
          text-decoration: underline;
          text-align: center;
          color: #ffffff;
          font-size: 28px;
          font-weight: 500;
          line-height: 1.11;
          letter-spacing: 0.4px;
          margin-bottom: 24px;
        `}
      >
        {loggedInUser.title.replace(/^./, m => m.toUpperCase())}. {loggedInUser.firstName}{' '}
        {loggedInUser.lastName}
      </Link>
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
