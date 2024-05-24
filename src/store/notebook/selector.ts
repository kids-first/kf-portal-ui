import { RootState } from 'store/types';

import { initialState } from './types';

export type NotebookProps = initialState;

export const notebookSelector = (state: RootState) => state.notebook;
