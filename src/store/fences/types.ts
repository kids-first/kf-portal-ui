import { IAuthorizedStudies } from '@ferlab/ui/core/components/AuthorizedStudies';
import { IFence } from '@ferlab/ui/core/components/AuthorizedStudies';

export type initialState = {
  authorizedStudies: IAuthorizedStudies;
  gen3: IFence;
  dcf: IFence;
  cavatica: IFence;
};

export interface IAuthorizedStudiesFetchParams {
  [key: string]: {
    acl: string[];
  };
}
