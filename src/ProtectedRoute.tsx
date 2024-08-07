import { Navigate, useLocation } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

import { REDIRECT_URI_KEY } from 'common/constants';
import PageLayout from 'components/Layout';
import { STATIC_ROUTES } from 'utils/routes';

type TProtectedRoute = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: TProtectedRoute) => {
  const location = useLocation();
  const { keycloak } = useKeycloak();

  if (!keycloak.authenticated) {
    return (
      <Navigate
        to={`${STATIC_ROUTES.LOGIN}?${REDIRECT_URI_KEY}=${location.pathname}${location.search}`}
      />
    );
  }

  if (location.pathname === STATIC_ROUTES.LOGIN) {
    return <Navigate to={STATIC_ROUTES.DASHBOARD} />;
  }

  return (
    <PageLayout>
      <>{children}</>
    </PageLayout>
  );
};

export default ProtectedRoute;
