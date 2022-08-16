import { useEffect } from 'react';
import { FENCE_NAMES } from 'common/fenceTypes';
import { FenceApi } from 'services/api/fence';

type OwnProps = {
  fence: FENCE_NAMES;
};

/*
 * Redirect Page Component
 * This component gets rendered in a new window. Nothing is rendered.
 * The code query param is sent to the Fence Token endpoint to request a token pair.
 */
const FenceRedirect = ({ fence }: OwnProps) => {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      FenceApi.exchangeCode(fence, code).then(({ error }) => {
        if (!error) {
          window.close();
        } else {
          console.error(error);
          window.alert(JSON.stringify(error));
          window.close();
        }
      });
    } else {
      window.alert(
        'Something went wrong (no code in the response), please refresh your window and try again.',
      );
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

export default FenceRedirect;
