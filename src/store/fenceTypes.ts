export type FenceName = string;

export type AclsByFence = {
  [fenceName: string]: string[];
};

export type UserAcls = string[];

export type FencesAllConcatenatedAcls = string[];
