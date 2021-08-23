import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'antd';
import { compose } from 'recompose';

import useUser from 'hooks/useUser';
import { withApi } from 'services/api';
import { deleteAccount } from 'store/actionCreators/user';

export default compose(withApi)(({ api, label = 'Cancel', onClickCB }) => {
  const dispatch = useDispatch();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Button
      loading={isLoading}
      onClick={async () => {
        setIsLoading(true);
        await dispatch(deleteAccount(api, user));
        if (onClickCB) {
          await onClickCB();
        }
        setIsLoading(false);
      }}
    >
      {label}
    </Button>
  );
});
