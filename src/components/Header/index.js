import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Alert, Badge, Layout } from 'antd';
import {
  DatabaseOutlined,
  FolderOutlined,
  UserOutlined,
  TeamOutlined,
  HomeOutlined,
} from '@ant-design/icons';

import logoPath from 'assets/logo-kids-first-data-portal.svg';
import Row from 'uikit/Row';
import { withApi } from 'services/api';
import { LinkAsButton, NavBarList, NavLink } from './ui';
import AppsMenu from './AppsMenu';
import { KEY_PUBLIC_PROFILE_INVITE_IS_SEEN } from 'common/constants';
import ROUTES from 'common/routes';
import { loggedInUserShape } from 'shapes/index';

import UserMenu from './UserMenu';

import './Header.css';

import { dismissError } from 'store/actionCreators/errors';
import { isPartOfGroup } from '../../common/profile';

const { Header: AntHeader } = Layout;

const showPublicProfileInvite = (user = {}) =>
  Boolean(user) && !user.isPublic && !localStorage.getItem(KEY_PUBLIC_PROFILE_INVITE_IS_SEEN);

const onClosePublicProfileInviteAlert = () =>
  localStorage.setItem(KEY_PUBLIC_PROFILE_INVITE_IS_SEEN, 'true');

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

const Header = (props) => {
  const {
    currentError,
    dismissError,
    loggedInUser,
    history,
    match: { path },
  } = props;

  const canSeeProtectedRoutes =
    loggedInUser &&
    loggedInUser.roles &&
    loggedInUser.roles[0] &&
    loggedInUser.acceptedTerms &&
    path !== '/join' &&
    path !== '/';
  const currentPathName = history.location.pathname;

  return (
    <AntHeader className="headerContainer">
      {renderAlertIfAny(loggedInUser, currentError, dismissError)}
      <div className="gradientAccent" />
      <Row className="headerContent">
        <Row>
          <Link to={ROUTES.dashboard}>
            <img src={logoPath} alt="Kids First Logo" style={{ width: '211px', height: '65px' }} />
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
              {isPartOfGroup('kf-investigator', loggedInUser) && (
                <li>
                  <NavLink currentPathName={currentPathName} to={ROUTES.variantDb}>
                    <Badge count={'New'} style={{ backgroundColor: '#52c41a' }} offset={[15, -15]}>
                      <DatabaseOutlined /> Variant DB
                    </Badge>
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
          {canSeeProtectedRoutes ? <UserMenu loggedInUser={loggedInUser} /> : null}
        </NavBarList>
      </Row>
    </AntHeader>
  );
};

Header.propTypes = {
  // redux
  loggedInUser: loggedInUserShape,
  currentError: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  }),
  dismissError: PropTypes.func.isRequired,
  // react-router-dom
  history: PropTypes.shape({
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
  enabledFeatures: PropTypes.object,
};

const mapStateToProps = (state) => ({
  loggedInUser: state.user.loggedInUser,
  currentError: state.errors.currentError,
});

const mapDispatchToProps = {
  dismissError,
};

export default compose(withRouter, withApi, connect(mapStateToProps, mapDispatchToProps))(Header);
