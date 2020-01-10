import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import autobind from 'auto-bind-es5';
import { compose } from 'recompose';
import HouseIcon from 'react-icons/lib/fa/home';
import DatabaseIcon from 'react-icons/lib/fa/database';
import UserIcon from 'react-icons/lib/fa/user';
import ExploreDataIcon from 'icons/ExploreDataIcon';

import logoPath from 'assets/logo-kids-first-data-portal.svg';
import Row from 'uikit/Row';
import { withApi } from 'services/api';
import { NavLink, LinkAsButton, NavBarList } from './ui';
import AppsMenu from './AppsMenu';
import { isFeatureEnabled } from 'common/featuresToggles';
import { Alert, Badge } from 'antd';
import { KEY_PUBLIC_PROFILE_INVITE_IS_SEEN } from 'common/constants';
import ROUTES from 'common/routes';
import { loggedInUserShape } from 'shapes/index';
import  queryString  from 'query-string'

import UserMenu from './UserMenu';

import './Header.css';

import { dismissError } from 'store/actionCreators/errors';
import { enableFeature } from 'store/actionCreators/enableFeatures';

const isSearchMemberFeatEnabled = (queryString) => isFeatureEnabled('searchMembers', queryString); //TODO : remove me one day :)

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

class Header extends React.Component {
  static propTypes = {
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
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  componentDidMount() {
    const queries = queryString.parse(this.props.location.search);

    enableFeature('TOTO')
  }

  render() {
    const {
      currentError,
      dismissError,
      loggedInUser,
      history,
      match: { path },
    } = this.props;

    const canSeeProtectedRoutes =
      loggedInUser &&
      loggedInUser.roles &&
      loggedInUser.roles[0] &&
      loggedInUser.acceptedTerms &&
      path !== '/join' &&
      path !== '/';
    const currentPathName = history.location.pathname;

    return (
      <div className="headerContainer">
        {renderAlertIfAny(loggedInUser, currentError, dismissError)}
        <div className="gradientAccent" />
        <Row className="headerContent">
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
                {isSearchMemberFeatEnabled(queryString.parse(this.props.location.search)) && (
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loggedInUser: state.user.loggedInUser,
  currentError: state.errors.currentError,
  enabledFeatures: state.queries,
});

const mapDispatchToProps = {
  dismissError,
  enableFeature,
};

export default compose(withRouter, withApi, connect(mapStateToProps, mapDispatchToProps))(Header);