import React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { fenceTokensUri } from 'common/injectGlobals';
import { withApi } from 'services/api';

import { FenceName } from '../../store/fenceTypes';
import { RootState } from '../../store/rootState';
import { selectUserToken } from '../../store/selectors/users';

type OwnProps = {
  api: (config: AxiosRequestConfig) => Promise<AxiosResponse>;
  fence: FenceName;
};
/*
 * Redirect Page Component
 * This component gets rendered in a new window. Nothing is rendered.
 * The code query param is sent to the Fence Token endpoint to request a token pair.
 */
const FenceAuthRedirect = ({ api, fence }: OwnProps) => {
  const userToken = useSelector((state: RootState) => selectUserToken(state));

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code && userToken) {
      api({
        url: `${fenceTokensUri}?fence=${fence}&code=${code}`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then(() => {
          window.close();
        })
        .catch((err: Error) => {
          console.error(err);
          window.alert('Something went wrong, please refresh your window and try again.');
          window.close();
        });
    } else {
      if (!code) {
        window.alert(
          'Something went wrong (no code in the response), please refresh your window and try again.',
        );
      } else {
        window.alert(
          'Something went wrong (no ego token), please refresh your window and try again.',
        );
      }
      window.close();
    }
  });

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <strong>Please wait while you are redirected.</strong>
      <strong>Do not close or refresh your browser.</strong>
    </div>
  );
};

export default withApi(FenceAuthRedirect);
