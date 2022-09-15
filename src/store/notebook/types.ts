import { NotebookApiStatus } from 'services/api/notebook/model';

export type initialState = {
  url?: string | null;
  status: NotebookApiStatus;
  error?: any;
  isLoading: boolean;
};
