import { graphql } from '../../services/arranger';
import { TreeNode } from 'antd/lib/tree-select';

type PhenotypeSource = {
  key: string;
  doc_count: number;
  top_hits: {
    parents: string[];
  };
  matches?: number;
};

export type TreeNode = {
  title: React.ReactElement | string;
  text: string;
  key: string;
  hasChildren?: boolean;
  children: TreeNode[];
  results?: number;
  hidden?: boolean;
  depth?: number;
};

export class PhenotypeStore {
  // Flat representation of phenotype from graphql source
  phenotypes: PhenotypeSource[] = [];
  // Tree of Phenotype Node
  tree: TreeNode[] = [];

  fetch = (sqon?: any) => {
    this.phenotypes = [];
    this.tree = [];
    return this.getPhenotypes(sqon).then((data: PhenotypeSource[]) => {
      const stripedData = this.remoteSingleRootNode(data);
      this.phenotypes = stripedData;
      this.tree = this.generateTree();
      return true;
    });
  };

  createNodeFromSource = (
    ontologySource: PhenotypeSource,
    parent?: TreeNode,
    depth: number = 0,
  ) => ({
    title: ontologySource.key,
    text: ontologySource.key,
    key: parent ? `${parent.key}-${ontologySource.key}` : ontologySource.key,
    children: [],
    results: ontologySource.doc_count,
    value: ontologySource.doc_count,
    name: ontologySource.key,
    depth,
  });

  private populateNodeChild = (treeNode: TreeNode, source: PhenotypeSource, depth: number = 0) => {
    this.phenotypes.forEach((phenotypeSource: PhenotypeSource) => {
      if (phenotypeSource.top_hits.parents.includes(source.key)) {
        let childNode = this.createNodeFromSource(phenotypeSource, treeNode, depth);
        treeNode.children.push(this.populateNodeChild(childNode, phenotypeSource, depth + 1));
      }
    });
    return treeNode;
  };

  generateTree = () => {
    let workingTree: TreeNode[] = [];
    let workingPhenotypes = [...this.phenotypes];

    workingPhenotypes.forEach((sourcePhenotype) => {
      let phenotype: TreeNode;
      // start from root and then look for each element inhereting from that node
      if (!sourcePhenotype.top_hits.parents.length) {
        phenotype = this.createNodeFromSource(sourcePhenotype);
        workingTree.push(this.populateNodeChild(phenotype, sourcePhenotype, 1));
      }
    });
    return workingTree;
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

  getChildrenKeys = (node: TreeNode, root = false) => {
    let nKeys: string[] = [];
    node.children.forEach((i) => {
      nKeys = nKeys.concat(this.getChildrenKeys(i));
    });
    if (!root) {
      nKeys.push(node.key);
    }
    return nKeys;
  };

  getTree = (maxDepth: number = 2) => {
    if (this.tree.length === 0) return [];

    const newTree = [...this.tree];
    const cleanTree = (node: TreeNode) => {
      if (!node.depth) return;
      if (node.depth >= maxDepth) {
        delete node.children;
      } else if (node.children.length > 0) {
        for (let n of node.children) {
          cleanTree(n);
        }
      }
    };
    cleanTree(newTree[0]);
    return newTree;
  };

  buildPhenotypeQuery = () => `query($sqon: JSON) {
    participant {
      aggregations(filters: $sqon, aggregations_filter_themselves: false) {
        observed_phenotype__name {
          buckets{
            key,
            doc_count,
            top_hits(_source: "observed_phenotype.parents", size: 1)
          }
        }
      }
    }
  }
  `;

  getPhenotypes = async (sqon?: any) => {
    const body = {
      query: this.buildPhenotypeQuery(),
      variables: JSON.stringify({
        sqon: sqon,
      }),
    };
    try {
      const { data } = await graphql()(body);
      return data.data.participant.aggregations.observed_phenotype__name.buckets;
    } catch (error) {
      console.warn(error);
      return [];
    }
  };

  remoteSingleRootNode = (phenotypes: PhenotypeSource[]) => {
    return phenotypes
      .map((p) => (p.key !== 'All (HP:0000001)' ? p : null))
      .filter((p): p is PhenotypeSource => p !== null)
      .map((p) => {
        const index = p.top_hits.parents.indexOf('All (HP:0000001)');
        if (!index) {
          p.top_hits.parents.splice(index, 1);
        }
        return p;
      });
  };
}
