import { BooleanOperators } from '@ferlab/ui/core/data/sqon/operators';
import { ISyntheticSqon } from '@ferlab/ui/core/data/sqon/types';
import { IPhenotypeSource } from 'graphql/summary/models';

import { ArrangerApi } from 'services/api/arranger';

import OntologyTree, { lightTreeNodeConstructor, TreeNode, TTitleFormatter } from './OntologyTree';

export const RegexExtractPhenotype = new RegExp(/([A-Za-z].*?\((HP|MONDO):[0-9]+\))/, 'g');

export const TARGET_ROOT_PHENO = 'Phenotypic abnormality (HP:0000118)';

export const generateNavTreeFormKey = (phenotypes: string[]): TreeNode[] => {
  if (!phenotypes.length) {
    return [];
  }

  if (phenotypes.length === 1) {
    const leafPheno = phenotypes.pop();

    if (!leafPheno) {
      return [];
    }

    return [lightTreeNodeConstructor(leafPheno)];
  }

  const rootPheno = phenotypes.pop();

  return rootPheno ? [lightTreeNodeConstructor(rootPheno, generateNavTreeFormKey(phenotypes))] : [];
};

export class PhenotypeStore {
  phenotypes: IPhenotypeSource[] = [];
  tree: TreeNode | undefined = undefined;

  fetch = async ({
    field,
    sqon,
    filterThemselves,
    titleFormatter,
  }: {
    field: string;
    sqon?: ISyntheticSqon;
    filterThemselves?: boolean;
    titleFormatter?: TTitleFormatter;
  }) => {
    this.phenotypes = [];
    this.tree = undefined;

    return this.getPhenotypes(field, sqon, filterThemselves).then((data: IPhenotypeSource[]) => {
      const ontologyTree = new OntologyTree(data, field, titleFormatter);
      this.phenotypes = ontologyTree.phenotypes;
      this.tree = ontologyTree.tree;
    });
  };

  getRootNode = () => this.tree;

  getPhenotypes = async (field: string, sqon?: ISyntheticSqon, filterThemselves = false) => {
    const body = {
      type: field,
      sqon: {
        ...sqon,
        content: sqon?.content || [],
        op: sqon?.op || BooleanOperators.and,
      },
      aggregations_filter_themselves: filterThemselves,
    };

    const { data, error } = await ArrangerApi.fetchPhenotypes<any>(body);

    if (error || data?.data.errors) {
      return [];
    }

    return data?.data || [];
  };
}
