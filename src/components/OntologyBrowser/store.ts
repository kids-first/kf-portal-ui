import { Sqon } from 'store/sqon';

import { graphql } from '../../services/arranger';

import OntologyTree, { lightTreeNodeConstructor, TreeNode } from './Model';

export type PhenotypeSource = {
  key: string;
  doc_count: number;
  top_hits: {
    parents: string[];
  };
  filter_by_term: any;
};

const RegexHPOCode = /^.+(\(HP:\d+\)$)/;
export const RegexExtractPhenotype = new RegExp(/([A-Z].+?\(HP:\d+\))/, 'g');

export const dotToUnderscore = (str: string) => str.replace('.', '__');

const termRegex = new RegExp('[^-]+$');

export const removeSameTerms = (selectedKeys: string[], targetKeys: string[]) => {
  let allSelectedAndChecked = {};

  selectedKeys.concat(targetKeys).forEach((t) => {
    allSelectedAndChecked = { ...allSelectedAndChecked, [`${t.match(termRegex)}`]: t };
  });

  return [...(Object.values(allSelectedAndChecked) as string[])];
};

export const selectSameTerms = (selectedKeys: string[], tree: TreeNode[] | undefined) => {
  let enhancedSelectedKeys: string[] = [];

  if (!tree) return [];

  selectedKeys.forEach((k) => {
    const match = k.match(termRegex);
    if (match) {
      const matched = match.pop();
      enhancedSelectedKeys = [
        ...enhancedSelectedKeys,
        ...findAllSameTerms(k, matched || '', tree[0]),
      ];
    }
  });

  return enhancedSelectedKeys;
};

const findAllSameTerms = (
  termKey: string,
  searchKey: string,
  treeNode: TreeNode,
  sameTermKeys: string[] = [],
) => {
  const termPattern = new RegExp(`.*${searchKey.replace(/(?=[()])/g, '\\')}$`);

  if (termPattern.test(treeNode.key) && termKey !== treeNode.key) {
    sameTermKeys.push(treeNode.key);
  }

  if (treeNode.children.length > 0) {
    treeNode.children.forEach((t) => findAllSameTerms(termKey, searchKey, t, sameTermKeys));
  }
  return sameTermKeys;
};

export const generateNavTreeFormKey = (
  phenotypes: string[],
  selectedPhenotypeInfoTitle: string,
): TreeNode[] => {
  if (!phenotypes.length) {
    return [];
  }

  if (phenotypes.length === 1) {
    const leafPheno = phenotypes.pop();

    if (!leafPheno) {
      return [];
    }

    return [lightTreeNodeConstructor(leafPheno, selectedPhenotypeInfoTitle)];
  }

  const rootPheno = phenotypes.pop();

  return rootPheno
    ? [
        lightTreeNodeConstructor(
          rootPheno,
          selectedPhenotypeInfoTitle,
          generateNavTreeFormKey(phenotypes, selectedPhenotypeInfoTitle),
        ),
      ]
    : [];
};

export const splitHPOTerm = (term: string) => {
  const match = RegexHPOCode.exec(term);
  return {
    name: term.replace(match ? match[1] : '', '').trim(),
    code: match ? match[1].replace('(', '').replace(')', '') : '',
  };
};

export class PhenotypeStore {
  // Flat representation of phenotype from graphql source
  phenotypes: PhenotypeSource[] = [];
  // Tree of Phenotype Node
  tree: TreeNode[] = [];

  fetch = (field: string, sqon?: Sqon, filterThemselves?: boolean, noGlobalAggs?: boolean) => {
    this.phenotypes = [];
    this.tree = [];
    return this.getPhenotypes(field, sqon, filterThemselves, noGlobalAggs).then(
      (data: PhenotypeSource[]) => {
        const ontologyTree = new OntologyTree(this.remoteSingleRootNode(data), field);
        this.phenotypes = ontologyTree.phenotypes;
        this.tree = ontologyTree.tree;
      },
    );
  };

  getTree = () => {
    if (this.tree.length === 0) return [];
    return [...this.tree];
  };

  buildPhenotypeQuery = (
    field: string,
    filterThemselves: boolean,
    noGlobalAggs?: boolean,
  ) => `query($sqon: JSON, $term_filters: JSON) {
    participant {
      aggregations(
      filters: $sqon, 
      aggregations_filter_themselves: ${filterThemselves}
      ${noGlobalAggs ? `no_global_aggregation: ${noGlobalAggs}` : ''}
      ) {
        ${dotToUnderscore(field)}__name {
          buckets{
            key,
            doc_count,
            top_hits(_source: ["${field}.parents"], size: 1)
            filter_by_term(filter: $term_filters)
          }
        }
      }
    }
  }
  `;

  getPhenotypes = async (
    field: string,
    sqon?: Sqon,
    filterThemselves = false,
    noGlobalAggs?: boolean,
  ) => {
    const body = {
      query: this.buildPhenotypeQuery(field, filterThemselves, noGlobalAggs),
      variables: JSON.stringify({
        sqon: sqon,
        term_filters: [
          {
            field: `${field}.is_tagged`,
            value: true,
          },
        ],
      }),
    };
    try {
      const { data } = await graphql()(body);
      return data.data.participant.aggregations[dotToUnderscore(field) + '__name'].buckets;
    } catch (error) {
      // console.warn(error);
      return [];
    }
  };

  getTreeNodeForKey = (key: string, treeNode = this.tree): TreeNode | null => {
    let result: TreeNode | null = null;
    for (let i = 0; i < treeNode.length; i++) {
      if (treeNode[i].key === key) {
        result = treeNode[i];
        break;
      }
      result = this.getTreeNodeForKey(key, treeNode[i].children);
      if (result) {
        break;
      }
    }
    return result;
  };

  getChildrenKeys = (node: TreeNode, root = false): string[] => [
    ...node.children.flatMap((i) => this.getChildrenKeys(i)),
    ...(!root ? [node.key] : []),
  ];

  remoteSingleRootNode = (phenotypes: PhenotypeSource[]) =>
    phenotypes
      .map((p) => (p.key !== 'All (HP:0000001)' ? p : null))
      .filter((p): p is PhenotypeSource => p !== null)
      .map((p) => {
        const index = p.top_hits.parents.indexOf('All (HP:0000001)');
        if (!index) {
          p.top_hits.parents.splice(index, 1);
        }
        return p;
      });
}
