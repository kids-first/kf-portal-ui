import React from 'react';
import Gravtar from 'uikit/Gravatar';
import { Link } from 'react-router-dom';
import EditButton from './EditButton';

import { H2,  SmallText, P } from '../../uikit/Typography';
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
    <CompletionWrapper completed={percentageFilled} innerCircleSize="83.18%">
      <Gravtar
        email={loggedInUser.email || ''}
        size={180}
        css={`
          background-color: ${theme.colors.white};
          border: 1px solid ${theme.colors.borderGrey};
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
    <div
      css={`
        ${theme.text.center};
        * {
          color: ${theme.colors.white};
        }
      `}
    >
      <H2 my="0">
        <Link
          to={`/user/${loggedInUser.egoId}#aboutMe`}
          css={`
            color: ${theme.colors.white};
            text-decoration: none;
            &:hover {
              text-decoration: underline;
            }
          `}
        >
          {loggedInUser.title && loggedInUser.title.replace(/^./, m => m.toUpperCase()) + '. '}
          {loggedInUser.firstName} {loggedInUser.lastName}
        </Link>
      </H2>
      {[
        loggedInUser.jobTitle && (
          <H2 my="0">
            <SmallText>{loggedInUser.jobTitle}</SmallText>
          </H2>
        ),
        loggedInUser.institution,
        [loggedInUser.city, loggedInUser.state].filter(Boolean).join(', '),
        loggedInUser.country,
      ]
        .filter(Boolean)
        .map((str, i) => (
          <P my="0" lineHeight={3} color="white" key={`${str}${i}`}>
            {str}
          </P>
        ))}
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
