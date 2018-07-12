import React from 'react';
import { Link } from 'react-router-dom';
import Gravtar from './Gravatar';
import CompletionWrapper from '../components/UserProfile/CompletionWrapper';
import RoleIconButton from '../components/RoleIconButton';
import { H2, H3, P, SmallText } from './Typography';
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
      background-color: ${theme.white};
      border: 1px solid ${theme.borderGrey};
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
      align-content: flex-start;
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
        margin-left: ${orientation === 'horizontal' ? '20px' : '0'};
      `}
    >
      <RoleIconButton
        css={`
          margin: ${orientation === 'vertical' ? '20px auto' : '0 0 20px 0'};
          width: ${RoleIconButtonInner ? '290px' : '160px'};
        `}
      >
        {RoleIconButtonInner && RoleIconButtonInner()}
      </RoleIconButton>
      <div
        css={`
          ${orientation === 'vertical' ? theme.textStyles.center : theme.textStyles.left};
        `}
      >
        <H2 my={0}>
          <Link
            to={`/user/${profile.egoId}#aboutMe`}
            css={`
              color: ${theme.white};
              text-decoration: none;
              &:hover {
                ${theme.textStyles.underline};
              }
            `}
          >
            {profile.title && profile.title.replace(/^./, m => m.toUpperCase()) + '. '}
            {profile.firstName} {profile.lastName}
          </Link>
        </H2>

        {profile.jobTitle ? (
          <H3 my="0" color="white">
            {profile.jobTitle}{' '}
          </H3>
        ) : null}
        {profile.institution ? (
          <H3 mt="10px" mb="0" color="white" fontWeight="thin">
            {profile.institution}
          </H3>
        ) : null}

        {[[profile.city, profile.state].filter(Boolean).join(', '), profile.country]
          .filter(Boolean)
          .map((str, i) => (
            <P my="0" color="white" key={`${str}${i}`}>
              <SmallText>{str}</SmallText>
            </P>
          ))}
        <P
          css={`
            ${theme.textStyles.underline};
            color: ${theme.white};
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
