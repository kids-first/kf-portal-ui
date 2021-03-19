export enum EsIndex {
  PARTICIPANT = 'participant',
  FILE = 'file',
}

export type ProjectId = string;

export type Edge = {
  node: {
    [index: string]: any;
  };
};
