import { graphql } from '../../services/arranger';

export type PhenotypeSource = {
  key: string;
  doc_count: number;
  top_hits: {
    parents: string[];
  };
  filter_by_term: any;
};

export type TreeNode = {
  title: React.ReactElement | string;
  text: string;
  key: string;
  hasChildren?: boolean;
  children: TreeNode[];
  results?: number;
  exactTagCount?: number;
  hidden?: boolean;
  depth?: number;
};

const dotToUnderscore = (str: string) => str.replace('.', '__');

export class PhenotypeStore {
  // Flat representation of phenotype from graphql source
  phenotypes: PhenotypeSource[] = [];
  // Tree of Phenotype Node
  tree: TreeNode[] = [];

  fetch = (field: string, sqon?: any, filterThemselves?: boolean) => {
    this.phenotypes = [];
    this.tree = [];
    return this.getPhenotypes(field, sqon, filterThemselves).then((data: PhenotypeSource[]) => {
      this.phenotypes = this.remoteSingleRootNode(data);
      this.tree = this.generateTree(field);
      return true;
    });
  };

  private populateNodeChild = (
    treeNode: TreeNode,
    source: PhenotypeSource,
    depth: number = 0,
    field: string,
  ) => {
    this.phenotypes.forEach((phenotypeSource: PhenotypeSource) => {
      if (phenotypeSource.top_hits.parents.includes(source.key)) {
        const childNode = this.createNodeFromSource(phenotypeSource, field, treeNode, depth);
        treeNode.children.push(
          this.populateNodeChild(childNode, phenotypeSource, depth + 1, field),
        );
      }
    });
    return treeNode;
  };

  generateTree = (field: string) => {
    const workingTree: TreeNode[] = [];
    const workingPhenotypes = [...this.phenotypes];
    workingPhenotypes.forEach((sourcePhenotype) => {
      let phenotype: TreeNode;
      // start from root and then look for each element inhereting from that node
      if (!sourcePhenotype.top_hits.parents.length || workingPhenotypes.length === 1) {
        phenotype = this.createNodeFromSource(sourcePhenotype, field);
        workingTree.push(this.populateNodeChild(phenotype, sourcePhenotype, 1, field));
      }
    });
    return workingTree;
  };

  createNodeFromSource = (
    ontologySource: PhenotypeSource,
    exactTagField: string,
    parent?: TreeNode,
    depth: number = 0,
  ) => ({
    title: ontologySource.key,
    text: ontologySource.key,
    key: parent ? `${parent.key}-${ontologySource.key}` : ontologySource.key,
    children: [],
    results: ontologySource.doc_count,
    exactTagCount: ontologySource.filter_by_term
      ? ontologySource.filter_by_term[`${exactTagField}.is_tagged.term_filter`].doc_count
      : 0,
    value: ontologySource.doc_count,
    name: ontologySource.key,
    depth,
  });

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

  getTree = () => {
    if (this.tree.length === 0) return [];
    return [...this.tree];
  };

  buildPhenotypeQuery = (
    field: string,
    filterThemselves: boolean,
  ) => `query($sqon: JSON, $term_filters: JSON) {
    participant {
      aggregations(filters: $sqon, aggregations_filter_themselves: ${filterThemselves}) {
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

  getPhenotypes = async (field: string, sqon?: any, filterThemselves = false) => {
    const body = {
      query: this.buildPhenotypeQuery(field, filterThemselves),
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
