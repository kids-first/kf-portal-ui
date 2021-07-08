import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  concatAllFencesAcls,
  fetchAllFencesConnectionsIfNeeded,
} from 'store/actionCreators/fenceConnections';
import { Api } from 'store/apiTypes';
import { DispatchFenceConnections, FenceConnections } from 'store/fenceConnectionsTypes';
import { FenceName, FencesAllConcatenatedAcls } from 'store/fenceTypes';
import { RootState } from 'store/rootState';
import {
  selectFenceConnections,
  selectIsFetchingAllFenceConnections,
} from 'store/selectors/fenceConnections';

type Output = {
  isFetchingAllFenceConnections: boolean;
  isCheckingIfFenceConnectionsFetchIsNeeded: boolean;
  fenceConnections: FenceConnections;
  fencesAllAcls: FencesAllConcatenatedAcls;
};

const useFenceConnections = (api: Api, fenceNames: FenceName[]): Output => {
  const [isCheckingIfFetchIsNeeded, setIsCheckingIfFetchIsNeeded] = useState(true);
  const fenceConnections = useSelector((state: RootState) => selectFenceConnections(state));
  const isFetchingAllFenceConnections = useSelector((state: RootState) =>
    selectIsFetchingAllFenceConnections(state),
  );
  const dispatch: DispatchFenceConnections = useDispatch();

  //motive: without ref, if you do useFenceConnections(api, [myFenceName]) you will create an infinite loop
  //https://github.com/facebook/react/issues/18243#issuecomment-596052010
  const { current: fencesRef } = useRef(fenceNames);

  useEffect(() => {
    setIsCheckingIfFetchIsNeeded(false);
    dispatch(fetchAllFencesConnectionsIfNeeded(api, fencesRef));
  }, [fencesRef, dispatch, api]);

  return {
    isFetchingAllFenceConnections,
    fenceConnections,
    fencesAllAcls: concatAllFencesAcls(fenceConnections),
    isCheckingIfFenceConnectionsFetchIsNeeded: isCheckingIfFetchIsNeeded,
  };
};
export default useFenceConnections;
