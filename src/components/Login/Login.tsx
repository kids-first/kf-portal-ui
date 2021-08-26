import React from 'react';
import { Redirect } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { Button } from 'antd';

import ROUTES from 'common/routes';

const Login = (): React.ReactElement => {
  const { keycloak } = useKeycloak();
  const isAuthenticated = keycloak.authenticated || false;

  if (isAuthenticated) {
    return <Redirect to={ROUTES.dashboard} />;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Button
        type={'primary'}
        onClick={async () =>
          await keycloak.login({
            // eslint-disable-next-line max-len
            redirectUri: `${window.location.origin}/${ROUTES.dashboard}`,
          })
        }
      >
        {'Login'}
      </Button>
    </div>
  );
};
export default Login;
