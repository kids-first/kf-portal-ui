import * as React from 'react';
import Component from 'react-component-component';
import { withApi } from 'services/api';
import { compose } from 'recompose';

import { getFenceUser } from 'services/fence';

const enhance = compose(withApi);

const FenceUserProvider = ({ render, fence, api }) => {
  const initialState = { fenceUser: null, loading: true, error: null };

  const refresh = ({ state, setState }) => () => {
    setState({ loading: true });
    return getFenceUser(api, fence)
      .then(user => {
        setState({ fenceUser: user, loading: false, error: null });
      })
      .catch(err => {
        console.log(err);
        setState({ fenceUser: null, loading: false, error: err });
      });
  };

  return (
    <Component initialState={initialState} didMount={s => refresh(s)()}>
      {s =>
        render({
          fenceUser: s.state.fenceUser,
          loading: s.state.loading,
          error: s.state.error,
          refresh: refresh(s),
        })
      }
    </Component>
  );
};

export default enhance(FenceUserProvider);
