import { RootState } from 'store/types';
import { initialState } from 'store/persona/types';

export type PersonaProps = initialState;

export const personaSelector = (state: RootState) => {
  return state.persona;
};
