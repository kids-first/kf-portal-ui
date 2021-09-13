export type AclsByFence = {
  [fenceName: string]: string[];
};

export type UserAcls = string[];

export type FencesAllConcatenatedAcls = string[];

export enum FenceName {
  gen3 = 'gen3',
  dcf = 'dcf',
}

export const AllFencesNames = [FenceName.gen3, FenceName.dcf];
