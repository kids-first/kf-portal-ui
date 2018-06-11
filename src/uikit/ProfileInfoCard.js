import React from 'react';
import { Link } from 'react-router-dom';
import Gravtar from './Gravatar';
import CompletionWrapper from '../components/UserProfile/CompletionWrapper';
import RoleIconButton from '../components/RoleIconButton';
import { H2, P, SmallText } from './Typography';
import { withTheme } from 'emotion-theming';

export const ProfileGravtar = ({ profile, theme, size }) => (
  <Gravtar
    email={profile.email || ''}
    size={size}
    css={`
      box-sizing: border-box;
      width: 100%;
      max-width: 185px;
      height: 100%;
      border-radius: 50%;
      background-color: ${theme.colors.white};
      border: 1px solid ${theme.colors.borderGrey};
    `}
  />
);

const ProfileInfoCard = ({
  orientation,
  theme,
  profile,
  gravatar,
  RoleIconButtonInner,
  ProfileProgress,
  buttons,
}) => (
  <div
    css={`
      width: 100%;
      display: flex;
      flex-direction: ${orientation ? (orientation === 'horizontal' ? 'row' : 'column') : 'row'};
      align-items: center;
      justify-content: space-between;
    `}
  >
    {ProfileProgress ? (
      <CompletionWrapper
        css={`
          margin: 0 auto;
        `}
        completed={ProfileProgress}
        innerCircleSize="83.18%"
      >
        <ProfileGravtar profile={profile} size={gravatar.size} theme={theme} />
      </CompletionWrapper>
    ) : (
      <ProfileGravtar profile={profile} size={gravatar.size} theme={theme} />
    )}
    <div
      css={`
        width: 100%;
        max-width: 300px;
        margin: 0 auto;
      `}
    >
      <RoleIconButton
        css={`
          margin: 20px 0;
          width: ${RoleIconButtonInner ? '290px' : '140px'};
        `}
      >
        {RoleIconButtonInner && RoleIconButtonInner()}
      </RoleIconButton>

      <div
        css={`
          ${orientation === 'vertical' ? theme.text.center : theme.text.left};
        `}
      >
        <H2 my="0" fontWeight="bold">
          <Link
            to={`/user/${profile.egoId}#aboutMe`}
            css={`
              color: ${theme.colors.white};
              text-decoration: none;
              &:hover {
                ${theme.text.underline};
              }
            `}
          >
            {profile.title && profile.title.replace(/^./, m => m.toUpperCase()) + '. '}
            {profile.firstName} {profile.lastName}
          </Link>
        </H2>
        {[
          profile.jobTitle && (
            <H2 my="0" color="white">
              <SmallText>{profile.jobTitle}</SmallText>
            </H2>
          ),
          profile.institution,
          [profile.city, profile.state].filter(Boolean).join(', '),
          profile.country,
        ]
          .filter(Boolean)
          .map((str, i) => (
            <P my="2px" lineHeight={3} color="white" key={`${str}${i}`}>
              {str}
            </P>
          ))}
        <P
          css={`
            ${theme.text.underline};
            color: ${theme.colors.white};
          `}
        >
          {profile.email}
        </P>
        {buttons && buttons({ profile, theme })}
      </div>
    </div>
  </div>
);

export default withTheme(ProfileInfoCard);
