import React from 'react';
import { Link } from 'react-router-dom';

import { compose } from 'recompose';
import { injectState } from 'freactal';

import Login from 'components/Login';
import LogoutButton from 'components/LogoutButton';

const Header = ({ state: { loggedInUser } }) => (
  <ul>
    <li>
      <Link to="/files">Files</Link>
    </li>
    {!loggedInUser && (
      <li>
        <Login />
      </li>
    )}
    {loggedInUser && (
      <li>
        <Link to={`/user/${loggedInUser.egoId}`}>User Profile</Link>
      </li>
    )}
    {loggedInUser && (
      <li>
        <LogoutButton />
      </li>
    )}
  </ul>
);

export default compose(injectState)(Header);
