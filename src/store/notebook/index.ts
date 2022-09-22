import { useSelector } from 'react-redux';
import { notebookSelector } from './selector';

export type { initialState as NotebookInitialState } from './types';
export { default, notebookState } from './slice';
export const useNotebook = () => useSelector(notebookSelector);
