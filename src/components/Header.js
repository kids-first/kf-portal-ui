import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import styled, { css } from 'react-emotion';
import { Trans } from 'react-i18next';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';

import ToSearchPage from 'components/links/ToSearchPage';

import logoPath from 'theme/images/logo-kids-first-data-portal.svg';
import HouseIcon from 'react-icons/lib/fa/home';
import DatabaseIcon from 'react-icons/lib/fa/database';

import Gravtar from 'uikit/Gravatar';
import Dropdown from 'uikit/Dropdown';
import { uiLogout } from 'components/LogoutButton';
import { withApi } from 'services/api';

const NavLink = styled(Link)`
  ${props => props.theme.navLink};
`;

const DropdownLink = styled(Link)`
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  &:hover {
    color: ${({ theme }) => theme.highlight};
  }
`;

const Header = ({
  state: { loggedInUser },
  effects: { setUser, setToken, clearIntegrationTokens },
  theme,
  history,
  match: { path },
  api,
}) => {
  const canSeeProtectedRoutes =
    loggedInUser &&
    (loggedInUser.roles &&
      loggedInUser.roles[0] &&
      loggedInUser.acceptedTerms &&
      path !== '/join' &&
      path !== '/');
  return (
    <div
      className={css`
        background: #fff;
        box-shadow: 0 0 4.9px 0.1px #bbbbbb;
        flex: none;
        z-index: 1;
      `}
    >
      <div
        className={css`
          width: 100%;
          height: 5px;
          background-image: linear-gradient(to right, #90278e, #cc3399 35%, #be1e2d 66%, #f6921e);
        `}
      />
      <div
        className={css`
          display: flex;
          justify-content: space-between;
          padding: 10px;
          align-items: center;
        `}
      >
        <div className={theme.row}>
          <Link to="/">
            <img
              src={logoPath}
              alt="Kids First Logo"
              className={css`
                width: 177px;
                height: 65px;
              `}
            />
          </Link>
          {canSeeProtectedRoutes && (
            <ul
              css={`
                ${theme.navBar};
                margin-left: 40px;
              `}
            >
              <li>
                <NavLink to="/dashboard">
                  <HouseIcon /> <Trans>Dashboard</Trans>
                </NavLink>
              </li>
              <li>
                <ToSearchPage index="file" css={theme.navLink}>
                  <DatabaseIcon /> <Trans>File Repository</Trans>
                </ToSearchPage>
              </li>
            </ul>
          )}
        </div>
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
                css={`
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
                <Gravtar
                  email={loggedInUser.email || ''}
                  size={39}
                  css={`
                    border-radius: 50%;
                    padding: 2px;
                    background-color: #fff;
                    border: 1px solid #cacbcf;
                    margin: 5px;
                  `}
                />
                {loggedInUser.firstName}
              </Dropdown>
            )}
        </ul>
      </div>
    </div>
  );
};

export default compose(injectState, withTheme, withRouter, withApi)(Header);
