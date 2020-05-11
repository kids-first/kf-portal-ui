export const MAX_MINUTES_TRY = 10; //minutes
export const INCREMENT = 2000;

export const clusterStatus = {
  stopped: 'STOPPED',
  createInProgress: 'CREATE_IN_PROGRESS',
  createComplete: 'CREATE_COMPLETE',
  deleteInProgress: 'DELETE_IN_PROGRESS',
  rollback: 'ROLLBACK_COMPLETE',
};

export const isInterimState = (status: string) =>
  status === clusterStatus.createInProgress || status === clusterStatus.deleteInProgress;

export const canBeDeleted = (status: string) =>
  status === clusterStatus.createInProgress ||
  status === clusterStatus.createComplete ||
  status === clusterStatus.rollback;
