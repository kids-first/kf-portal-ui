import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { computeAclsByFence } from 'store/actionCreators/fenceConnections';
import {
  computeAllFencesAuthStudies,
  fetchAllFenceStudiesIfNeeded,
} from 'store/actionCreators/fenceStudies';
import { Api } from 'store/apiTypes';
import { DispatchFenceStudies, FenceStudies, FenceStudy } from 'store/fenceStudiesTypes';
import { FenceName } from 'store/fenceTypes';
import { RootState } from 'store/rootState';
import { selectFenceConnections } from 'store/selectors/fenceConnections';
import { selectFenceStudies, selectLoadingStudiesForFences } from 'store/selectors/fenceStudies';

const { keys } = Object;

type Output = {
  loadingStudiesForFences: FenceName[];
  fenceStudies: FenceStudies;
  fenceAuthStudies: FenceStudy[];
};

const useFenceStudies = (api: Api): Output => {
  const dispatch: DispatchFenceStudies = useDispatch();

  const loadingStudiesForFences = useSelector((state: RootState) =>
    selectLoadingStudiesForFences(state),
  );
  const fenceStudies = useSelector((state: RootState) => selectFenceStudies(state));
  const fenceConnections = useSelector((state: RootState) => selectFenceConnections(state));

  useEffect(() => {
    const fences = keys(fenceConnections) as FenceName[];
    const aclsByFence = computeAclsByFence(fenceConnections);
    dispatch(fetchAllFenceStudiesIfNeeded(api, fences, aclsByFence));
  }, [fenceConnections, dispatch, api]);

  return {
    loadingStudiesForFences,
    fenceStudies,
    fenceAuthStudies: computeAllFencesAuthStudies(fenceStudies),
  };
};
export default useFenceStudies;
