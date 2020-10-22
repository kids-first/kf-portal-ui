import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Alert, Badge, Layout, Menu, Button } from 'antd';
import {
  DatabaseOutlined,
  FolderOutlined,
  UserOutlined,
  TeamOutlined,
  HomeOutlined,
} from '@ant-design/icons';

import logoPath from 'assets/logo-kids-first-data-portal.svg';
import Row from 'uikit/Row';
import { LinkAsButton, NavBarList } from './ui';
import AppsMenu from './AppsMenu';
import { KEY_PUBLIC_PROFILE_INVITE_IS_SEEN } from 'common/constants';
import ROUTES from 'common/routes';

import UserMenu from './UserMenu';

import './Header.css';

import { isPartOfGroup } from 'common/profile';
import { injectState } from 'freactal';

const { Header: AntHeader } = Layout;

const showPublicProfileInvite = (user = {}) =>
  Boolean(user) && !user.isPublic && !localStorage.getItem(KEY_PUBLIC_PROFILE_INVITE_IS_SEEN);

const onClosePublicProfileInviteAlert = () =>
  localStorage.setItem(KEY_PUBLIC_PROFILE_INVITE_IS_SEEN, 'true');

const getUrlForUser = (user, hash = '') => `${ROUTES.user}/${user._id}${hash}`;

const renderAlertIfAny = (loggedInUser) => {
  if (showPublicProfileInvite(loggedInUser)) {
    return (
      <Alert
        message={
          <>
            <Link to={getUrlForUser(loggedInUser, '#settings')}>Make your profile public</Link>
            {' so that other members can view it!'}
          </>
        }
        type="info"
        banner
        closable
        onClose={onClosePublicProfileInviteAlert}
      />
    );
  }
  return null;
};

const routeNames = [
  ROUTES.dashboard,
  ROUTES.cohortBuilder,
  ROUTES.variantDb,
  `${ROUTES.search}/file`,
  ROUTES.searchMember,
];

const menuItemStyle = { borderBottom: 'none', margin: '0 8px' };

const Header = (props) => {
  const {
    history,
    match: { path },
    state: { loggedInUser, egoGroups },
  } = props;

  const handleClick = (e) => {
    history.push(e.key);
  };

  const currentPathName = history.location.pathname;

  const generateActiveStyle = (route) =>
    currentPathName === route
      ? {
          background: '#F5E5F1',
          color: '#A6278F',
          border: '1px solid #F5E5F1',
        }
      : null;

  const canSeeProtectedRoutes = path !== '/join';
  const currentProtectedMenuItem =
    routeNames.find((routeName) => currentPathName.startsWith(routeName)) || '';
  return (
    <AntHeader className="headerContainer">
      {renderAlertIfAny(loggedInUser)}
      <div className="gradientAccent" />
      <Row className="headerContent">
        <Row>
          <Link to={ROUTES.dashboard}>
            <img src={logoPath} alt="Kids First Logo" className={'logo'} />
          </Link>
          {canSeeProtectedRoutes && (
            <Menu
              mode="horizontal"
              onClick={handleClick}
              selectedKeys={[currentProtectedMenuItem]}
              className={'menu'}
            >
              <Menu.Item key={ROUTES.dashboard} style={menuItemStyle}>
                <Button
                  className={`button-common`}
                  type="ghost"
                  style={generateActiveStyle(ROUTES.dashboard)}
                  icon={<HomeOutlined fill={'#A6278F'} />}
                >
                  Dashboard
                </Button>
              </Menu.Item>
              <Menu.Item key={ROUTES.cohortBuilder} style={menuItemStyle}>
                <Button
                  className={`button-common`}
                  type="ghost"
                  style={generateActiveStyle(ROUTES.cohortBuilder)}
                  icon={<TeamOutlined fill={'#A6278F'} />}
                >
                  Explore Data
                </Button>
              </Menu.Item>
              {isPartOfGroup('kf-investigator', egoGroups) && (
                <Menu.Item
                  key={ROUTES.variantDb}
                  /* different style since the badge overlaps neighbour icon */
                  style={{ borderBottom: 'none', margin: '0 15px' }}
                >
                  <Badge count={'New'} style={{ backgroundColor: '#52c41a' }}>
                    <Button
                      className={`button-common`}
                      type="ghost"
                      style={generateActiveStyle(ROUTES.variantDb)}
                      icon={<DatabaseOutlined fill={'#A6278F'} />}
                    >
                      Variant Workbench
                    </Button>
                  </Badge>
                </Menu.Item>
              )}
              <Menu.Item key={`${ROUTES.search}/file`} style={menuItemStyle}>
                <Button
                  className={`button-common`}
                  type="ghost"
                  style={generateActiveStyle(`${ROUTES.search}/file`)}
                  icon={<FolderOutlined fill={'#A6278F'} />}
                >
                  File Repository
                </Button>
              </Menu.Item>
              <Menu.Item key={ROUTES.searchMember} style={menuItemStyle}>
                <Button
                  className={`button-common`}
                  type="ghost"
                  style={generateActiveStyle(ROUTES.searchMember)}
                  icon={<UserOutlined fill={'#A6278F'} />}
                >
                  Members
                </Button>
              </Menu.Item>
            </Menu>
          )}
        </Row>
        <NavBarList style={{ justifyContent: 'flex-end' }}>
          {!loggedInUser && (
            <li>
              {path === '/' ? (
                <LinkAsButton to={ROUTES.join}>Join now</LinkAsButton>
              ) : (
                <LinkAsButton to={ROUTES.login}>Login</LinkAsButton>
              )}
            </li>
          )}

          <AppsMenu />
          {canSeeProtectedRoutes ? <UserMenu /> : null}
        </NavBarList>
      </Row>
    </AntHeader>
  );
};

Header.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
  enabledFeatures: PropTypes.object,
  state: PropTypes.shape({
    loggedInUser: PropTypes.object.isRequired,
    egoGroups: PropTypes.array,
  }).isRequired,
};

export default compose(injectState, withRouter)(Header);
