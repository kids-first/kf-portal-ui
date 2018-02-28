import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { css } from 'react-emotion';

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

  li {
    a {
      display: block;
      color: #90278e;
      padding: 6px 16px;
      margin: 0px 4px;
      text-decoration: none;
      border: solid 2px transparent;
    }

    a:hover {
      border-radius: 19px;
      background-color: #404c9a;
      border: solid 2px #dcdde3;
      color: #ffffff;
    }
  }
`;

const Header = ({ state: { loggedInUser }, theme, history }) => {
  const hasRoleSelected = !loggedInUser || (loggedInUser.roles && loggedInUser.roles[0]);
  return (
    <div
      className={css`
        background-image: linear-gradient(to bottom, #fff 50%, transparent);
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
          padding: 40px 40px 0 40px;
        `}
      >
        <div className={theme.row}>
          <Link to="/">
            <img
              src={logoPath}
              alt="Kids First Logo"
              className={css`
                width: 244px;
                height: 100px;
              `}
            />
          </Link>
          <ul className={navBar}>
            <li>
              <Link to="/">
                <HouseIcon /> Dashboard
              </Link>
            </li>
            {loggedInUser && (
              <li>
                <ToSearchPage index="file">
                  <DatabaseIcon /> File Repository
                </ToSearchPage>
              </li>
            )}
          </ul>
        </div>
        <ul
          className={css`
            ${navBar};
            justify-content: flex-end;
          `}
        >
          {loggedInUser &&
            hasRoleSelected && (
              <li>
                <Link to={`/user/${loggedInUser.egoId}`}>User Profile</Link>
              </li>
            )}
          {!loggedInUser && (
            <li>
              <button className={theme.button} onClick={() => history.push('/join')}>
                Sign-Up/Login
              </button>
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
