import React from 'react';
import styled from 'react-emotion';
import { get } from 'lodash';
import { css } from 'react-emotion';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import PencilIcon from 'react-icons/lib/fa/pencil';
import { ROLES } from 'common/constants';
import { H3 } from '../../uikit/Typography';
import { Trans } from 'react-i18next';

export const Container = styled('div')`
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 76%;
`;

export const EditButton = compose(withTheme)(({ theme, ...props }) => (
  <button css={theme.hollowButton} {...props}>
    <PencilIcon className={'icon'} /> Edit
  </button>
));

export const SectionHeader = ({ theme, children, title }) => (
  <div
    css={`
      box-sizing: border-box;
      border-bottom: 1px solid #d4d6dd;
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      padding-bottom: 10px;
      H3 {
        display: inline-block;
      }
    `}
  >
    <H3 my="0" fontWeight="thin">
      <Trans>{title}</Trans>
    </H3>
    {children}
  </div>
);

export const H4 = styled('h4')`
  ${({ theme }) => theme.h4} color: ${({ theme }) => theme.greyScale1};
  font-weight: 700;
  ${({ theme }) => theme.spacing.collapse};
`;

export const userProfileBackground = (
  loggedInUser,
  { showBanner = true, gradientDirection = 'right' } = {},
) => {
  const role = ROLES.find(x => x.type === get(loggedInUser, 'roles[0]', '')) || {};
  const banner = get(role, 'banner', '');
  const profileColors = get(role, 'profileColors', {});
  return css`
    background-position-x: right;
    background-repeat: no-repeat;
    background-image: ${showBanner ? `url(${banner}), ` : ``}
      linear-gradient(
        to ${gradientDirection},
        ${profileColors.gradientDark} 33%,
        ${profileColors.gradientMid} 66%,
        ${profileColors.gradientLight}
      );
  `;
};
