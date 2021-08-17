import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

import ROUTES from 'common/routes';

import useUser from './hooks/useUser';
import { hasUserRole } from './utils';

const ProtectedRoute = ({ ...routeProps }: RouteProps) => {
  const { user, isAuthenticated } = useUser();
  const userNeedsToLogin = !user || !isAuthenticated;
  if (userNeedsToLogin) {
    return <Redirect to={ROUTES.login} />;
  }

  if (!hasUserRole(user)) {
    return <Redirect to={ROUTES.join} />;
  }

  if (!user!.acceptedTerms) {
    return <Redirect to={ROUTES.termsConditions} />;
  }

  const currentPath = routeProps.path;
  if (currentPath === ROUTES.login) {
    // is already authenticated but tries to reach the login page
    return <Redirect to={ROUTES.dashboard} />;
  }

  return <Route {...routeProps} />;
};

export default ProtectedRoute;
