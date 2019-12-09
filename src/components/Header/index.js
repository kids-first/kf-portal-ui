import React, { Fragment } from 'react';
import { connect } from 'react-redux';
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
import { Alert, Badge } from 'antd';
import { KEY_PUBLIC_PROFILE_INVITE_IS_SEEN } from 'common/constants';
import ROUTES from 'common/routes';

import { dismissError } from 'store/actionCreators/errors';

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

const onClosePublicProfileInviteAlert = () =>
  localStorage.setItem(KEY_PUBLIC_PROFILE_INVITE_IS_SEEN, true);

const getUrlForUser = (user, hash = '') => `${ROUTES.user}/${user._id}${hash}`;

const renderAlertIfAny = (loggedInUser, currentError, dismissError) => {
  if (currentError) {
    return (
      <Alert
        message={
          <Fragment>
            <span style={{ fontWeight: 'bold' }}>Error: </span>
            <span>{currentError.message}</span>
          </Fragment>
        }
        type="error"
        banner
        closable
        onClose={() => dismissError(currentError.uuid)}
      />
    );
  }

  if (showPublicProfileInvite(loggedInUser)) {
    return (
      <Alert
        message={
          <Fragment>
            <Link to={getUrlForUser(loggedInUser, '#settings')}>Make your profile public</Link>
            {' so that other members can view it!'}
          </Fragment>
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

const Header = ({
  currentError,
  dismissError,
  state: { loggedInUser },
  effects: { setUser, setToken, clearIntegrationTokens },
  history,
  match: { path },
  api,
}) => {
  const canSeeProtectedRoutes =
    loggedInUser &&
    loggedInUser.roles &&
      loggedInUser.roles[0] &&
      loggedInUser.acceptedTerms &&
      path !== '/join' &&
      path !== '/';
  const currentPathName = history.location.pathname;

  return (
    <DropDownState
      render={({ isDropdownVisible, toggleDropdown, setDropdownVisibility }) => (
        <HeaderContainer>
          {renderAlertIfAny(loggedInUser, currentError, dismissError)}
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
                        <Badge
                          count={'New'}
                          style={{ backgroundColor: '#52c41a' }}
                          offset={[25, -10]}
                        >
                          <UserIcon /> Members
                        </Badge>
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
                  <NavigationGravatar email={loggedInUser.email || ''} d={'mp'} size={39} />
                  <DropdownRow>{loggedInUser.firstName}</DropdownRow>
                </Dropdown>
              )}
            </NavBarList>
          </HeaderContent>
        </HeaderContainer>
      )}
    />
  );
};

const mapStateToProps = state => ({
  currentError: state.errors.currentError,
});

const mapDispatchToProps = {
  dismissError,
};

export default compose(
  injectState,
  withRouter,
  withApi,
  connect(mapStateToProps, mapDispatchToProps),
)(Header);
