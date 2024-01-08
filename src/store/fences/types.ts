import { IAuthorizedStudies, IFence } from '@ferlab/ui/core/components/Widgets/AuthorizedStudies';

export type InitialState = {
  authorizedStudies: IAuthorizedStudies;
  gen3: IFence;
  dcf: IFence;
};

export interface IAuthorizedStudiesFetchParams {
  [key: string]: {
    acl: string[];
  };
}
