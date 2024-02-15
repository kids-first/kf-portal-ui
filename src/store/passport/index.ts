import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PASSPORT_AUTHENTIFICATION_STATUS } from '@ferlab/ui/core/components/Widgets/Cavatica/type';

import { passportSelector } from './selector';
import { fetchCavaticaAuthentificationStatus, fetchCavaticaProjects } from './thunks';

export type { InitialState as PassportInitialState } from './type';
export { default, passportState } from './slice';

export const useCavaticaPassport = () => {
  const state = useSelector(passportSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCavaticaAuthentificationStatus());
  }, []);

  useEffect(() => {
    if (state.cavatica.authentification.status === PASSPORT_AUTHENTIFICATION_STATUS.connected) {
      dispatch(fetchCavaticaProjects());
    }
  }, [state.cavatica.authentification.status]);

  return state.cavatica;
};
