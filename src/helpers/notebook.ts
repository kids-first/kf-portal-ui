import { NotebookApiStatus } from 'services/api/notebook/model';

export const isNotebookStatusLaunched = (status: NotebookApiStatus) =>
  [
    NotebookApiStatus.createComplete,
    NotebookApiStatus.stopped,
    NotebookApiStatus.rollback,
  ].includes(status);

export const isNotebookStatusInProgress = (status: NotebookApiStatus) =>
  [NotebookApiStatus.deleteInProgress, NotebookApiStatus.createInProgress].includes(status);

export const isNotebookRunning = (status: NotebookApiStatus) =>
  status === NotebookApiStatus.createComplete;
