import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import HouseIcon from 'react-icons/lib/fa/home';
import DatabaseIcon from 'react-icons/lib/fa/database';
import UserIcon from 'react-icons/lib/fa/user';
import styled from 'react-emotion';
import ExploreDataIcon from 'icons/ExploreDataIcon';

import logoPath from 'assets/logo-kids-first-data-portal.svg';
import Dropdown from 'uikit/Dropdown';
import Row from 'uikit/Row';
import { uiLogout } from 'components/LogoutButton';
import { withApi } from 'services/api';
import {
  NavLink,
  DropdownLink,
  HeaderContainer,
  GradientAccent,
  HeaderContent,
  Logo,
  NavigationGravatar,
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

const isSearchMemberFeatEnabled = isFeatureEnabled('searchMembers'); //TODO : remove me one day :)

const showPublicProfileInvite = (user = {}) => {
  if (!isSearchMemberFeatEnabled) {
    return false;
  }
  return (
    Boolean(user) &&
    !Boolean(user.isPublic) &&
    !Boolean(localStorage.getItem(KEY_PUBLIC_PROFILE_INVITE_IS_SEEN))
  );
};

const ExploreDataIconStyled = styled(ExploreDataIcon)`
  top: 3px;
  position: relative;
  fill: currentColor;
`;

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
        <HeaderContainer>
          <GradientAccent />
          <HeaderContent>
            <Row>
              <Link to={ROUTES.dashboard}>
                <Logo src={logoPath} alt="Kids First Logo" />
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
                      <ExploreDataIconStyled /> Explore Data
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
                  <NavigationGravatar email={loggedInUser.email || ''} size={39} />
                  <DropdownRow>{loggedInUser.firstName}</DropdownRow>
                </Dropdown>
              )}
            </NavBarList>
          </HeaderContent>
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
        </HeaderContainer>
      )}
    />
  );
};

export default compose(
  injectState,
  withRouter,
  withApi,
)(Header);
