import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import HouseIcon from 'react-icons/lib/fa/home';
import DatabaseIcon from 'react-icons/lib/fa/database';
import UserIcon from 'react-icons/lib/fa/user';
import ExploreDataIcon from 'icons/ExploreDataIcon';

import logoPath from 'assets/logo-kids-first-data-portal.svg';
import Dropdown from 'uikit/Dropdown';
import Row from 'uikit/Row';
import Gravatar from 'uikit/Gravatar';
import { uiLogout } from 'components/LogoutButton';
import { withApi } from 'services/api';
import {
  NavLink,
  DropdownLink,
  LinkAsButton,
  NavBarList,
  NavbarDropdownWrapper,
  NavbarDropdownOptionsContainer,
  DropdownRow,
  MenuLabelContainer,
} from './ui';
import AppsMenu, { DropDownState } from './AppsMenu';
import { isFeatureEnabled } from 'common/featuresToggles';
import { Alert } from 'antd';
import { KEY_PUBLIC_PROFILE_INVITE_IS_SEEN } from 'common/constants';
import ROUTES from 'common/routes';

import {
  headerContainer,
  gradientAccent,
  headerContent,
  headerProfilePicture,
} from './Header.module.css';

const isSearchMemberFeatEnabled = isFeatureEnabled('searchMembers'); //TODO : remove me one day :)

const showPublicProfileInvite = (user = {}) => {
  if (!isSearchMemberFeatEnabled) {
    return false;
  }
  return (
    !Boolean(user.isPublic) && !Boolean(localStorage.getItem(KEY_PUBLIC_PROFILE_INVITE_IS_SEEN))
  );
};

const onCloseAlert = () => localStorage.setItem(KEY_PUBLIC_PROFILE_INVITE_IS_SEEN, true);
const getUrlForUser = (user, hash = '') => `${ROUTES.user}/${user._id}${hash}`;

const Header = ({
  state: { loggedInUser },
  effects: { setUser, setToken, clearIntegrationTokens },
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
  const currentPathName = history.location.pathname;

  return (
    <DropDownState
      render={({ isDropdownVisible, toggleDropdown, setDropdownVisibility }) => (
        <div className={headerContainer}>
          <div className={gradientAccent} />
          <Row className={headerContent}>
            <Row>
              <Link to={ROUTES.dashboard}>
                <img
                  src={logoPath}
                  alt="Kids First Logo"
                  style={{ width: '211px', height: '65px' }}
                />
              </Link>
              {canSeeProtectedRoutes && (
                <NavBarList ml={40}>
                  <li>
                    <NavLink currentPathName={currentPathName} to={ROUTES.dashboard}>
                      <HouseIcon /> Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink currentPathName={currentPathName} to={ROUTES.cohortBuilder}>
                      <ExploreDataIcon
                        style={{ top: '3px', position: 'relative', fill: 'currentColor' }}
                      />{' '}
                      Explore Data
                    </NavLink>
                  </li>
                  <li>
                    <NavLink currentPathName={currentPathName} to={`${ROUTES.search}/file`}>
                      <DatabaseIcon /> File Repository
                    </NavLink>
                  </li>
                  {isSearchMemberFeatEnabled && (
                    <li>
                      <NavLink currentPathName={currentPathName} to={ROUTES.searchMember}>
                        <UserIcon /> Members Search
                      </NavLink>
                    </li>
                  )}
                </NavBarList>
              )}
            </Row>
            <NavBarList justify={'flex-end'}>
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

              {loggedInUser && canSeeProtectedRoutes && (
                <Dropdown
                  align="left"
                  isOpen={isDropdownVisible}
                  onToggle={toggleDropdown}
                  onOuterClick={() => setDropdownVisibility(false)}
                  items={[
                    <DropdownLink
                      onClick={toggleDropdown}
                      to={getUrlForUser(loggedInUser, '#aboutMe')}
                    >
                      My Profile
                    </DropdownLink>,
                    <DropdownLink
                      onClick={toggleDropdown}
                      to={getUrlForUser(loggedInUser, '#settings')}
                    >
                      Settings
                    </DropdownLink>,
                    <DropdownLink
                      to={ROUTES.dashboard}
                      separated
                      onClick={e => {
                        e.preventDefault();
                        toggleDropdown();
                        uiLogout({ history, setToken, setUser, clearIntegrationTokens, api });
                      }}
                    >
                      Logout
                    </DropdownLink>,
                  ]}
                  ItemWrapperComponent={({ id, children }) => {
                    return <Fragment key={id} children={children} />;
                  }}
                  ContainerComponent={NavbarDropdownWrapper}
                  OptionsContainerComponent={NavbarDropdownOptionsContainer}
                  LabelContainer={MenuLabelContainer}
                >
                  <Gravatar
                    className={headerProfilePicture}
                    email={loggedInUser.email || ''}
                    size={39}
                  />
                  <DropdownRow>{loggedInUser.firstName}</DropdownRow>
                </Dropdown>
              )}
            </NavBarList>
          </Row>
          {showPublicProfileInvite(loggedInUser) && (
            <Alert
              message={
                <Fragment>
                  <Link to={getUrlForUser(loggedInUser, '#settings')}>
                    Make your profile public
                  </Link>
                  {' so that other members can view it!'}
                </Fragment>
              }
              type="info"
              banner
              closable
              onClose={onCloseAlert}
            />
          )}
        </div>
      )}
    />
  );
};

export default compose(
  injectState,
  withRouter,
  withApi,
)(Header);
