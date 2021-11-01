import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Menu } from 'antd';

import ROUTES from 'common/routes';
import useUser from 'hooks/useUser';
import { revertAcceptedTermsThenLogoutCleanly } from 'store/actionCreators/user';
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

const UserMenu = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { user } = useUser();
  // Menu is not displayed if no user is connected, or if we don't have the user profile yet
  if (!user) {
    return null;
  }

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case 'profile':
        history.push(getUrlForUser(user, '#aboutMe'));
        break;
      case 'settings':
        history.push(getUrlForUser(user, '#settings'));
        break;
      case 'logout':
        dispatch(revertAcceptedTermsThenLogoutCleanly());
        break;
    }
  };

  return (
    <HeaderMenu onClick={handleMenuClick} menuItems={menuItems}>
      <Gravatar className="headerProfilePicture" email={user.email || ''} size={24} />
      <span className="userName">{user.firstName}</span>
    </HeaderMenu>
  );
};

export default UserMenu;
