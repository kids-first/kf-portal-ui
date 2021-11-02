import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
  DatabaseOutlined,
  FolderOutlined,
  HomeOutlined,
  ReadOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Alert, Layout } from 'antd';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import logoPath from 'assets/logo-kids-first-data-portal.svg';
import { KEY_PUBLIC_PROFILE_INVITE_IS_SEEN } from 'common/constants';
import ROUTES from 'common/routes';

import useUser from '../../hooks/useUser';

import AppsMenu from './AppsMenu';
import { LinkAsButton, NavBarList, NavLink } from './ui';
import UserMenu from './UserMenu';

import './Header.css';

const { Header } = Layout;

const showPublicProfileInvite = (user = {}) =>
  user && !user.isPublic && !localStorage.getItem(KEY_PUBLIC_PROFILE_INVITE_IS_SEEN);

const onClosePublicProfileInviteAlert = () =>
  localStorage.setItem(KEY_PUBLIC_PROFILE_INVITE_IS_SEEN, 'true');

const getUrlForUser = (user, hash = '') => `${ROUTES.user}/${user._id}${hash}`;

const NavigationToolBar = (props) => {
  const {
    history,
    match: { path },
  } = props;
  const { user } = useUser();

  const currentPathName = history.location.pathname;

  const canSeeProtectedRoutes = path !== '/join';

  return (
    <Header className="headerContainer">
      {showPublicProfileInvite(user) && (
        <Alert
          message={
            <>
              <Link to={getUrlForUser(user, '#settings')}>Make your profile public</Link>
              {' so that other members can view it!'}
            </>
          }
          type="info"
          banner
          closable
          onClose={onClosePublicProfileInviteAlert}
        />
      )}
      <div className="gradientAccent" />
      <StackLayout className="headerContent">
        <StackLayout className="leftContent">
          <Link className="logoLink" to={ROUTES.dashboard}>
            <img src={logoPath} alt="Kids First Logo" className={'logo'} />
          </Link>
          {canSeeProtectedRoutes && (
            <NavBarList ml={40}>
              <li>
                <NavLink currentPathName={currentPathName} to={ROUTES.dashboard}>
                  <HomeOutlined /> Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink currentPathName={currentPathName} to={ROUTES.studies}>
                  <ReadOutlined /> Studies
                </NavLink>
              </li>
              <li>
                <NavLink currentPathName={currentPathName} to={ROUTES.cohortBuilder}>
                  <TeamOutlined /> Explore Data
                </NavLink>
              </li>

              <li>
                <NavLink currentPathName={currentPathName} to={ROUTES.variant}>
                  <DatabaseOutlined /> Variant
                </NavLink>
              </li>
              <li>
                <NavLink currentPathName={currentPathName} to={`${ROUTES.search}/file`}>
                  <FolderOutlined /> File Repository
                </NavLink>
              </li>
              <li>
                <NavLink currentPathName={currentPathName} to={ROUTES.searchMember}>
                  <UserOutlined /> Members
                </NavLink>
              </li>
            </NavBarList>
          )}
        </StackLayout>
        <NavBarList style={{ justifyContent: 'flex-end' }}>
          <AppsMenu />
          {!user && (
            <li>
              {path === '/' ? (
                <LinkAsButton to={ROUTES.join}>Join now</LinkAsButton>
              ) : (
                <LinkAsButton to={ROUTES.login}>Login</LinkAsButton>
              )}
            </li>
          )}
          {canSeeProtectedRoutes ? <UserMenu /> : null}
        </NavBarList>
      </StackLayout>
    </Header>
  );
};

NavigationToolBar.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
};

export default compose(withRouter)(NavigationToolBar);
