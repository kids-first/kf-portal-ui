import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import styled, { css } from 'react-emotion';

import { compose } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';

import LogoutButton from 'components/LogoutButton';
import ToSearchPage from 'components/links/ToSearchPage';

import logoPath from 'theme/images/logo-kids-first-data-portal.svg';
import HouseIcon from 'react-icons/lib/fa/home';
import DatabaseIcon from 'react-icons/lib/fa/database';

const navBar = css`
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: montserrat;
  font-size: 14px;
  line-height: 1.86;
  letter-spacing: 0.2px;
`;

const NavLink = styled(Link)`
  ${props => props.theme.navLink};
`;

const Header = ({ state: { loggedInUser }, theme, history, match: { path } }) => {
  const canSeeProtectedRoutes =
    !loggedInUser ||
    (loggedInUser.roles && loggedInUser.roles[0] && loggedInUser.acceptedTerms && path !== '/join');
  return (
    <div
      className={css`
        background: #fff;
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
          <ul css={navBar}>
            {canSeeProtectedRoutes && [
              <li>
                <NavLink to="/">
                  <HouseIcon /> Dashboard
                </NavLink>
              </li>,
              <li>
                <ToSearchPage index="file" css={theme.navLink}>
                  <DatabaseIcon /> File Repository
                </ToSearchPage>
              </li>,
            ]}
          </ul>
        </div>
        <div>
          <input
            className={theme.input}
            type="text"
            name="quicksearch"
            placeholder="&#x1F50D; Quicksearch"
          />
        </div>
        <ul
          className={css`
            ${navBar};
            justify-content: flex-end;
          `}
        >
          {loggedInUser &&
            canSeeProtectedRoutes && (
              <li>
                <NavLink to={`/user/${loggedInUser.egoId}`}>User Profile</NavLink>
              </li>
            )}
          {!loggedInUser && (
            <li>
              {path === '/' ? (
                <Link css={theme.linkAsButton} to="/join">
                  JOIN NOW
                </Link>
              ) : (
                <Link css={theme.linkAsButton} to="/">
                  LOGIN
                </Link>
              )}
            </li>
          )}
          {loggedInUser && (
            <li>
              <LogoutButton />
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default compose(injectState, withTheme, withRouter)(Header);
