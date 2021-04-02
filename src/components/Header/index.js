import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Alert, Layout } from 'antd';
import {
  DatabaseOutlined,
  FolderOutlined,
  UserOutlined,
  TeamOutlined,
  HomeOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import logoPath from 'assets/logo-kids-first-data-portal.svg';
import { LinkAsButton, NavBarList, NavLink } from './ui';
import AppsMenu from './AppsMenu';
import { KEY_PUBLIC_PROFILE_INVITE_IS_SEEN } from 'common/constants';
import ROUTES from 'common/routes';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { isFeatureEnabled } from 'common/featuresToggles';

import UserMenu from './UserMenu';

import './Header.css';

import { isKfInvestigator } from 'common/profile';
import { injectState } from 'freactal';

const { Header } = Layout;

const showPublicProfileInvite = (user = {}) =>
  Boolean(user) && !user.isPublic && !localStorage.getItem(KEY_PUBLIC_PROFILE_INVITE_IS_SEEN);

const onClosePublicProfileInviteAlert = () =>
  localStorage.setItem(KEY_PUBLIC_PROFILE_INVITE_IS_SEEN, 'true');

const getUrlForUser = (user, hash = '') => `${ROUTES.user}/${user._id}${hash}`;

const NavigationToolBar = (props) => {
  const {
    history,
    match: { path },
    state: { loggedInUser, egoGroups },
  } = props;

  const currentPathName = history.location.pathname;

  const canSeeProtectedRoutes = path !== '/join';

  return (
    <Header className="headerContainer">
      {showPublicProfileInvite(loggedInUser) && (
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
      )}
      <div className="gradientAccent" />
      <StackLayout className="headerContent">
        <StackLayout>
          <Link to={ROUTES.dashboard}>
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
                <NavLink currentPathName={currentPathName} to={ROUTES.cohortBuilder}>
                  <TeamOutlined /> Explore Data
                </NavLink>
              </li>
              {isFeatureEnabled('studiesPage') && (
                <li>
                  <NavLink currentPathName={currentPathName} to={ROUTES.studies}>
                    <ReadOutlined /> Studies
                  </NavLink>
                </li>
              )}
              {isKfInvestigator(egoGroups) && (
                <li>
                  <NavLink currentPathName={currentPathName} to={ROUTES.variantDb}>
                    <DatabaseOutlined /> Variant Workbench
                  </NavLink>
                </li>
              )}
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
  enabledFeatures: PropTypes.object,
  state: PropTypes.shape({
    loggedInUser: PropTypes.object.isRequired,
    egoGroups: PropTypes.array,
  }).isRequired,
};

export default compose(injectState, withRouter)(NavigationToolBar);
