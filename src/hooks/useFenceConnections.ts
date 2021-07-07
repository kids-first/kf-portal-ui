import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  concatAllFencesAcls,
  fetchAllFencesConnectionsIfNeeded,
} from 'store/actionCreators/fenceConnections';
import { Api } from 'store/apiTypes';
import { DispatchFenceConnections, FenceConnections } from 'store/fenceConnectionsTypes';
import { FencesAllConcatenatedAcls } from 'store/fenceTypes';
import { RootState } from 'store/rootState';
import {
  selectFenceConnections,
  selectIsFetchingAllFenceConnections,
} from 'store/selectors/fenceConnections';

type Output = {
  isFetchingAllFenceConnections: boolean;
  fenceConnections: FenceConnections;
  fencesAllAcls: FencesAllConcatenatedAcls;
};

const useFenceConnections = (api: Api, fences: string[]): Output => {
  const fenceConnections = useSelector((state: RootState) => selectFenceConnections(state));
  const isFetchingAllFenceConnections = useSelector((state: RootState) =>
    selectIsFetchingAllFenceConnections(state),
  );
  const dispatch: DispatchFenceConnections = useDispatch();

  useEffect(() => {
    dispatch(fetchAllFencesConnectionsIfNeeded(api, fences));
  }, [fences, dispatch, api]);

  return {
    isFetchingAllFenceConnections,
    fenceConnections,
    fencesAllAcls: concatAllFencesAcls(fenceConnections),
  };
};
export default useFenceConnections;
