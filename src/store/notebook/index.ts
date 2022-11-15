import { useSelector } from 'react-redux';
import { notebookSelector } from './selector';

export type { initialState as NotebookInitialState } from './types';
export { default, NotebookState as notebookState } from './slice';
export const useNotebook = () => useSelector(notebookSelector);
