import React from 'react';
import Gravtar from 'uikit/Gravatar';
import { Link } from 'react-router-dom';
import EditButton from './EditButton';
import styled from 'react-emotion';

import SettingsButton from './SettingsButton';
import CompletionWrapper from '../UserProfile/CompletionWrapper';
import RoleIconButton from '../RoleIconButton';
import { userProfileBackground } from '../UserProfile';

import { H2 } from 'uikit/Headings';

const UserLink = styled(Link)`
  line-height: 33px;
  display: block;
  text-align: center;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.white};
`;

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
      <UserLink to={`/user/${loggedInUser.egoId}#aboutMe`}>
        {loggedInUser.title && loggedInUser.title.replace(/^./, m => m.toUpperCase()) + '. '}
        <H2 color={theme.white}>
          {loggedInUser.firstName} {loggedInUser.lastName}
        </H2>
      </UserLink>
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
      <EditButton egoId={loggedInUser.egoId} />
      <SettingsButton egoId={loggedInUser.egoId} />
    </div>
  </div>
);
