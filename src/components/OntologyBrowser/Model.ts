import React from 'react';

import { hpoTreeTitleFormat } from '../UI/Charts/Sunburst/Sunburst';

import { PhenotypeSource, splitHPOTerm } from './store';

export type TreeNode = {
  title: React.ReactElement | string;
  text: string;
  key: string;
  hasChildren?: boolean;
  children: TreeNode[];
  results?: number;
  combinedResults?: number;
  exactTagCount?: number;
  hidden?: boolean;
  depth?: number;
  disabled?: boolean;
  value?: number; // for d3
  valueText: number; // required by d3 for displaying the value
  name?: string;
};

export const lightTreeNodeConstructor = (
  phenotype: string,
  selectedPhenotypeInfoTitle: string,
  children: TreeNode[] = [],
): TreeNode => {
  const splitPheno = splitHPOTerm(phenotype);

  return {
    title: hpoTreeTitleFormat(splitPheno, selectedPhenotypeInfoTitle),
    text: '',
    key: phenotype,
    children,
    valueText: 0,
  };
};

export default class OntologyTree {
  phenotypes: PhenotypeSource[] = [];
  tree: TreeNode[] = [];

  constructor(data: PhenotypeSource[], field: string) {
    this.phenotypes = data;
    this.tree = this.generateTree(field);
  }

  private getChildrenValue = (childrenNodes: TreeNode[], sourceValue: number) =>
    childrenNodes.length
      ? childrenNodes.reduce((accumulator, n) => accumulator + (n.valueText || 0), 0)
      : sourceValue || 0;

  private populateNodeChild = (
    source: PhenotypeSource,
    field: string,
    depth: number = 0,
    parentKey: string,
  ): TreeNode[] => {
    const nodes: TreeNode[] = [];
    this.phenotypes.forEach((phenotype: PhenotypeSource) => {
      if (phenotype.top_hits.parents.includes(source.key)) {
        const childrenNodes = this.populateNodeChild(
          phenotype,
          field,
          depth + 1,
          `${parentKey}-${phenotype.key}`,
        );
        const node = this.createNodeFromSource(phenotype, field, childrenNodes, depth, parentKey);
        nodes.push(node);
      }
    });
    return nodes;
  };

  generateTree = (field: string) => {
    const workingTree: TreeNode[] = [];
    const workingPhenotypes = [...this.phenotypes];
    workingPhenotypes.forEach((sourcePhenotype) => {
      let phenotype: TreeNode;
      // start from root and then look for each element inhereting from that node
      if (!sourcePhenotype.top_hits.parents.length || workingPhenotypes.length === 1) {
        const children = this.populateNodeChild(sourcePhenotype, field, 1, sourcePhenotype.key);
        phenotype = this.createNodeFromSource(sourcePhenotype, field, children);
        phenotype.children = children;
        workingTree.push(phenotype);
      }
    });
    return workingTree;
  };

  createNodeFromSource = (
    source: PhenotypeSource,
    exactTagField: string,
    children: TreeNode[] = [],
    depth: number = 0,
    parentKey?: string,
  ): TreeNode => {
    const value = this.getChildrenValue(children, source.doc_count);

    const result: TreeNode = {
      title: source.key,
      text: source.key,
      key: parentKey ? `${parentKey}-${source.key}` : source.key,
      children,
      results: source.doc_count,
      exactTagCount: source.filter_by_term?.doc_count || 0,
      name: source.key,
      depth,
      disabled: false,
      valueText: value,
    };

    if (value < source.doc_count) {
      result.value = source.doc_count - value;
      result.valueText = source.doc_count;
    } else if (children.length === 0) {
      result.value = value;
    }
    return result;
  };
}
