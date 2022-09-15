import { NotebookApiStatus } from 'services/api/notebook/model';

export const isNotebookStatusLaunched = (status: NotebookApiStatus) =>
  [
    NotebookApiStatus.createComplete,
    NotebookApiStatus.stopped,
    NotebookApiStatus.rollback,
  ].includes(status);

export const isNotebookStatusInProgress = (status: NotebookApiStatus) =>
  status === NotebookApiStatus.deleteInProgress || status === NotebookApiStatus.createInProgress;

export const isNotebookRunning = (status: NotebookApiStatus) =>
  status === NotebookApiStatus.createComplete;
