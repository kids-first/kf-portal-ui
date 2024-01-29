import { IArrangerResultsTree } from '@ferlab/ui/core/graphql/types';

export const toNodes = (o: IArrangerResultsTree<any>) => o?.hits?.edges?.map((x) => x.node) || [];
