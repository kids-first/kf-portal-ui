import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { computeAclsByFence } from 'store/actionCreators/fenceConnections';
import {
  computeAllFencesAuthStudies,
  fetchAllFenceStudiesIfNeeded,
} from 'store/actionCreators/fenceStudies';
import { Api } from 'store/apiTypes';
import { DispatchFenceStudies, FenceStudies, FenceStudy } from 'store/fenceStudiesTypes';
import { RootState } from 'store/rootState';
import { selectFenceConnections } from 'store/selectors/fenceConnections';
import { selectFenceStudies, selectIsFetchingAllFenceStudies } from 'store/selectors/fenceStudies';

const { keys } = Object;

type Output = {
  isFetchingAllFenceStudies: boolean;
  fenceStudies: FenceStudies;
  fenceAuthStudies: FenceStudy[];
};

const useFenceStudies = (api: Api): Output => {
  const dispatch: DispatchFenceStudies = useDispatch();

  const isFetchingAllFenceStudies = useSelector((state: RootState) =>
    selectIsFetchingAllFenceStudies(state),
  );
  const fenceStudies = useSelector((state: RootState) => selectFenceStudies(state));
  const fenceConnections = useSelector((state: RootState) => selectFenceConnections(state));

  useEffect(() => {
    const fences = keys(fenceConnections);
    const shouldFetch = fences.length > 0;
    if (shouldFetch) {
      const aclsByFence = computeAclsByFence(fenceConnections);
      dispatch(fetchAllFenceStudiesIfNeeded(api, fences, aclsByFence));
    }
  }, [fenceConnections, dispatch, api]);

  return {
    isFetchingAllFenceStudies,
    fenceStudies,
    fenceAuthStudies: computeAllFencesAuthStudies(fenceStudies),
  };
};
export default useFenceStudies;
