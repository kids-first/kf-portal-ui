import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DispatchFenceStudies } from 'store/fenceStudiesTypes';
import { RootState } from 'store/rootState';

import { checkIfUserIsConnectedIfNeeded } from '../store/actionCreators/cavatica';
import { DispatchCavatica } from '../store/cavaticaTypes';
import { selectIsCheckingStatus, selectIsConnected } from '../store/selectors/cavatica';

type Output = {
  isConnected: boolean;
  isCheckingIfConnected: boolean;
};

const useCavatica = (): Output => {
  const dispatch: DispatchFenceStudies = useDispatch<DispatchCavatica>();

  const isConnected = useSelector((state: RootState) => selectIsConnected(state));
  const isCheckingIfConnected = useSelector((state: RootState) => selectIsCheckingStatus(state));

  useEffect(() => {
    dispatch(checkIfUserIsConnectedIfNeeded());
  }, [dispatch]);

  return {
    isConnected,
    isCheckingIfConnected,
  };
};
export default useCavatica;
