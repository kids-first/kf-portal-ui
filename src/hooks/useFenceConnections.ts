import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  concatAllFencesAcls,
  fetchAllFencesConnectionsIfNeeded,
} from 'store/actionCreators/fenceConnections';
import { Api } from 'store/apiTypes';
import { ConnectionStatus } from 'store/connectionTypes';
import { DispatchFenceConnections, FenceConnections } from 'store/fenceConnectionsTypes';
import { FenceName, FencesAllConcatenatedAcls } from 'store/fenceTypes';
import { RootState } from 'store/rootState';
import {
  selectFenceConnections,
  selectFenceStatuses,
  selectLoadingFences,
} from 'store/selectors/fenceConnections';

type Output = {
  fenceConnections: FenceConnections;
  fencesAllAcls: FencesAllConcatenatedAcls;
  statuses: { [fenceName: string]: ConnectionStatus };
  loadingFences: FenceName[];
};

const useFenceConnections = (api: Api, fenceNames: FenceName[]): Output => {
  const fenceConnections = useSelector((state: RootState) => selectFenceConnections(state));
  const statuses = useSelector((state: RootState) => selectFenceStatuses(state));
  const loadingFences = useSelector((state: RootState) => selectLoadingFences(state));
  const dispatch: DispatchFenceConnections = useDispatch();

  //motive: without ref, if you do useFenceConnections(api, [myFenceName]) you will create an infinite loop
  //https://github.com/facebook/react/issues/18243#issuecomment-596052010
  const { current: fencesRef } = useRef(fenceNames);

  useEffect(() => {
    dispatch(fetchAllFencesConnectionsIfNeeded(api, fencesRef));
  }, [fencesRef, dispatch, api]);

  return {
    loadingFences,
    fenceConnections,
    fencesAllAcls: concatAllFencesAcls(fenceConnections),
    statuses,
  };
};
export default useFenceConnections;
