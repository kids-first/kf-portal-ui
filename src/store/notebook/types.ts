import { NotebookApiStatus } from 'services/api/notebook/model';

export type initialState = {
  url: string;
  status: NotebookApiStatus;
  error?: any;
  isLoading: boolean;
};
