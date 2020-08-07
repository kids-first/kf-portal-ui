import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import autobind from 'auto-bind-es5';
import { compose } from 'recompose';
import { Menu } from 'antd';

import HeaderMenu from './HeaderMenu';

import ROUTES from 'common/routes';
import { withApi } from 'services/api';
import { injectState } from 'freactal';

import Gravatar from 'uikit/Gravatar';
import { uiLogout } from 'components/LogoutButton';

import { effectsShape, historyShape } from 'shapes';

import './Header.css';

const getUrlForUser = (user, hash = '') => `${ROUTES.user}/${user._id}${hash}`;

class UserMenu extends React.Component {
  static propTypes = {
    effects: effectsShape.isRequired,
    history: historyShape.isRequired,
    api: PropTypes.func.isRequired,
    state: PropTypes.shape({
      loggedInUser: PropTypes.object,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleMenuClick({ key }) {
    const {
      history,
      api,
      effects: { setToken, setUser, clearIntegrationTokens },
      state: { loggedInUser },
    } = this.props;

    switch (key) {
      case 'profile':
        history.push(getUrlForUser(loggedInUser, '#aboutMe'));
        break;
      case 'settings':
        history.push(getUrlForUser(loggedInUser, '#settings'));
        break;
      case 'logout':
        uiLogout({ loggedInUser, setToken, setUser, clearIntegrationTokens, api, history });
        break;
      default:
        console.warn(`Unhandled menu item with key "${key}"`);
    }
  }

  render() {
    const {
      state: { loggedInUser },
    } = this.props;

    // Menu is not displayed if no user is connected, or if we don't have the user profile yet
    if (!loggedInUser) {
      return null;
    }

    const menuItems = [
      <Menu.Item key="profile">My Profile</Menu.Item>,
      <Menu.Item key="settings">Settings</Menu.Item>,
      <Menu.Divider key="divider 1" />,
      <Menu.Item key="logout">Logout</Menu.Item>,
    ];

    return (
      <HeaderMenu onClick={this.handleMenuClick} menuItems={menuItems}>
        <React.Fragment>
          <Gravatar className="headerProfilePicture" email={loggedInUser.email || ''} size={39} />
          <span className="userName">{loggedInUser.firstName}</span>
        </React.Fragment>
      </HeaderMenu>
    );
  }
}

export default compose(injectState, withRouter, withApi)(UserMenu);
