import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import HouseIcon from 'react-icons/lib/fa/home';
import DatabaseIcon from 'react-icons/lib/fa/database';

import logoPath from 'assets/logo-kids-first-data-portal-beta.svg';
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
import AppsMenu from './AppsMenu';
import { DropDownState } from 'services/utils';

const Header = ({
  state: { loggedInUser },
  effects: { setUser, setToken, clearIntegrationTokens },
  theme,
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
              <Link to="/dashboard">
                <Logo src={logoPath} alt="Kids First Logo" />
              </Link>
              {canSeeProtectedRoutes && (
                <NavBarList ml={40}>
                  <li>
                    <NavLink currentPathName={currentPathName} to="/dashboard">
                      <HouseIcon /> <Trans>Dashboard</Trans>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink currentPathName={currentPathName} to={`/search/file`}>
                      <DatabaseIcon /> <Trans>File Repository</Trans>
                    </NavLink>
                  </li>
                </NavBarList>
              )}
            </Row>
            <NavBarList justify={'flex-end'}>
              {!loggedInUser && (
                <li>
                  {path === '/' ? (
                    <LinkAsButton to="/join">
                      <Trans>Join now</Trans>
                    </LinkAsButton>
                  ) : (
                    <LinkAsButton to="/">
                      <Trans>Login</Trans>
                    </LinkAsButton>
                  )}
                </li>
              )}

              <AppsMenu />

              {loggedInUser &&
                canSeeProtectedRoutes && (
                  <Dropdown
                    align="left"
                    isOpen={isDropdownVisible}
                    onToggle={toggleDropdown}
                    onOuterClick={() => setDropdownVisibility(false)}
                    items={[
                      <DropdownLink
                        onClick={toggleDropdown}
                        to={`/user/${loggedInUser.egoId}#aboutMe`}
                      >
                        <Trans>My Profile</Trans>
                      </DropdownLink>,
                      <DropdownLink
                        onClick={toggleDropdown}
                        to={`/user/${loggedInUser.egoId}#settings`}
                      >
                        Settings
                      </DropdownLink>,
                      <DropdownLink
                        to={`/dashboard`}
                        separated
                        onClick={e => {
                          e.preventDefault();
                          toggleDropdown();
                          uiLogout({
                            history,
                            setToken,
                            setUser,
                            clearIntegrationTokens,
                            api,
                          });
                        }}
                      >
                        <Trans>Logout</Trans>
                      </DropdownLink>,
                    ]}
                    ItemWrapperComponent={props => <Fragment {...props} />}
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
        </HeaderContainer>
      )}
    />
  );
};

export default compose(injectState, withTheme, withRouter, withApi)(Header);
