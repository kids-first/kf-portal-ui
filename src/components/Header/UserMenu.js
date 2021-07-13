import React from 'react';
import { withRouter } from 'react-router-dom';
import { Menu } from 'antd';
import { injectState } from 'freactal';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import ROUTES from 'common/routes';
import { uiLogout } from 'components/LogoutButton';
import { withApi } from 'services/api';
import { effectsShape, historyShape } from 'shapes';
import Gravatar from 'uikit/Gravatar';

import HeaderMenu from './HeaderMenu';

import './Header.css';

const getUrlForUser = (user, hash = '') => `${ROUTES.user}/${user._id}${hash}`;

const menuItems = [
  <Menu.Item key="profile">My Profile</Menu.Item>,
  <Menu.Item key="settings">Settings</Menu.Item>,
  <Menu.Divider key="divider 1" />,
  <Menu.Item key="logout">Logout</Menu.Item>,
];

const UserMenu = (props) => {
  const {
    state: { loggedInUser },
    effects: { setToken, setUser, clearIntegrationTokens, setIsLoadingUser },
    history,
    api,
  } = props;

  // Menu is not displayed if no user is connected, or if we don't have the user profile yet
  if (!loggedInUser) {
    return null;
  }

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case 'profile':
        history.push(getUrlForUser(loggedInUser, '#aboutMe'));
        break;
      case 'settings':
        history.push(getUrlForUser(loggedInUser, '#settings'));
        break;
      case 'logout':
        uiLogout({
          loggedInUser,
          setToken,
          setUser,
          clearIntegrationTokens,
          api,
          history,
          setIsLoadingUser,
        });
        break;
      default:
        console.warn(`Unhandled menu item with key "${key}"`);
    }
  };

  return (
    <HeaderMenu onClick={handleMenuClick} menuItems={menuItems}>
      <Gravatar className="headerProfilePicture" email={loggedInUser.email || ''} size={39} />
      <span className="userName">{loggedInUser.firstName}</span>
    </HeaderMenu>
  );
};

UserMenu.propTypes = {
  effects: effectsShape.isRequired,
  history: historyShape.isRequired,
  api: PropTypes.func.isRequired,
  state: PropTypes.shape({
    loggedInUser: PropTypes.object,
  }).isRequired,
};

export default compose(injectState, withRouter, withApi)(UserMenu);
