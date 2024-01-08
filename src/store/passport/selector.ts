import { RootState } from 'store/types';

export const passportSelector = (state: RootState) => state.passport;
export const passportCavaticaSelector = (state: RootState) => state.passport.cavatica;
