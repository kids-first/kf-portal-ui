export enum NotebookApiStatus {
  stopped = 'STOPPED',
  createInProgress = 'CREATE_IN_PROGRESS',
  createComplete = 'CREATE_COMPLETE',
  deleteInProgress = 'DELETE_IN_PROGRESS',
  deleteComplete = 'DELETE_COMPLETE',
  rollback = 'ROLLBACK_COMPLETE',
  unverified = 'UNVERIFIED',
}

export type TNotebookApiResponse = {
  status: NotebookApiStatus;
  url?: string;
};
