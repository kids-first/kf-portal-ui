import { useSelector } from 'react-redux';
import { personaSelector } from './selector';

export type { initialState as PersonaInitialState } from './types';
export { default, PersonaState } from './slice';
export const usePersona = () => useSelector(personaSelector);
