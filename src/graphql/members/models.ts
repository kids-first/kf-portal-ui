import { IArrangerResultsTree } from '@ferlab/ui/core/graphql/types';
import { IPersonaUser } from 'services/api/persona/models';

export interface IMemberResultTree {
  members: IArrangerResultsTree<IMemberEntity>;
}

export type TSearchableInterests = {
  hits: {
    edges: {
      node: {
        name: string;
      };
    };
  };
};

export interface IMemberEntity
  extends Omit<
    IPersonaUser,
    'acceptedTerms' | 'acceptedKfOptIn' | 'acceptedNihOptIn' | 'acceptedDatasetSubscriptionKfOptIn'
  > {
  id: string;
  searchableInterests?: TSearchableInterests;
}

export interface IMemberEntityProfile {
  profile: IMemberEntity;
  loading: boolean;
  total: number;
}
