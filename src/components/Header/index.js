import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { css } from 'react-emotion';
import { Trans } from 'react-i18next';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';

import logoPath from 'theme/images/logo-kids-first-data-portal.svg';

import HouseIcon from 'react-icons/lib/fa/home';
import DatabaseIcon from 'react-icons/lib/fa/database';

import Dropdown from 'uikit/Dropdown';
import Row from 'uikit/Row';
import { uiLogout } from 'components/LogoutButton';
import { withApi } from 'services/api';

import {
  NavLink,
  DropdownLink,
  HeaderContainer,
  GradientAccent,
  HeaderContent,
  Logo,
  NavigationGravatar,
} from './ui';

const Header = ({
  state: { loggedInUser },
  effects: { setUser, setToken, clearIntegrationTokens },
  theme,
  history,
  match: { path },
  api,
  indeces = ['file'],
}) => {
  const canSeeProtectedRoutes =
    loggedInUser &&
    (loggedInUser.roles &&
      loggedInUser.roles[0] &&
      loggedInUser.acceptedTerms &&
      path !== '/join' &&
      path !== '/');
  const currentPathName = history.location.pathname;
  return (
    <HeaderContainer>
      <GradientAccent />
      <HeaderContent>
        <Row>
          <Link to="/">
            <Logo src={logoPath} alt="Kids First Logo" />
          </Link>
          {canSeeProtectedRoutes && (
            <ul
              css={`
                ${theme.navBar};
                margin-left: 40px;
              `}
            >
              <li>
                <NavLink currentPathName={currentPathName} to="/dashboard">
                  <HouseIcon /> <Trans>Dashboard</Trans>
                </NavLink>
              </li>
              {indeces.map(index => (
                <li>
                  <NavLink currentPathName={currentPathName} to={`/search/${index}`}>
                    <DatabaseIcon /> <Trans>File Repository</Trans>
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </Row>
        <ul
          className={css`
            ${theme.navBar};
            justify-content: flex-end;
          `}
        >
          {!loggedInUser && (
            <li>
              {path === '/' ? (
                <Link
                  css={`
                    ${theme.linkAsButton};
                    ${theme.uppercase};
                  `}
                  to="/join"
                >
                  <Trans>Join now</Trans>
                </Link>
              ) : (
                <Link
                  css={`
                    ${theme.linkAsButton};
                    ${theme.uppercase};
                  `}
                  to="/"
                >
                  <Trans>Login</Trans>
                </Link>
              )}
            </li>
          )}

          {loggedInUser &&
            canSeeProtectedRoutes && (
              <Dropdown
                items={[
                  <DropdownLink to={`/user/${loggedInUser.egoId}#aboutMe`}>
                    <Trans>My Profile</Trans>
                  </DropdownLink>,
                  <DropdownLink to={`/user/${loggedInUser.egoId}#settings`}>Settings</DropdownLink>,
                  <div
                    css={`
                      border-top: 1px solid ${theme.greyScale4};
                    `}
                  >
                    <a
                      onClick={() =>
                        uiLogout({ history, setToken, setUser, clearIntegrationTokens, api })
                      }
                      css={`
                        color: ${theme.primary};
                        text-decoration: none;
                      `}
                    >
                      <Trans>Logout</Trans>
                    </a>
                  </div>,
                ]}
                className={css`
                  border: 0;
                  color: ${theme.primary};

                  font-size: 14px;
                  font-weight: 500;
                  line-height: 1.86;
                  letter-spacing: 0.2px;

                  line-height: 1.86;
                  letter-spacing: 0.2px;
                  padding-right: 10px;
                `}
              >
                <NavigationGravatar email={loggedInUser.email || ''} size={39} />
                {loggedInUser.firstName}
              </Dropdown>
            )}
        </ul>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default compose(injectState, withTheme, withRouter, withApi)(Header);
