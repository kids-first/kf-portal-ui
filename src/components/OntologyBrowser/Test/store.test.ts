import React from 'react';
// import { render } from '@testing-library/react';
import { PhenotypeStore, TreeNode } from '../store';
import { flatMockData } from './mockData';

describe('Phenotype Store', () => {
  let newStore: PhenotypeStore;

  beforeAll(() => {
    newStore = new PhenotypeStore();
    newStore.getPhenotypes = jest.fn().mockReturnValue(Promise.resolve(flatMockData));
    return newStore.fetch();
  });

  it('should create first level', () => {
    let firstLevel = newStore.tree[0];
    expect(newStore.tree.length).toBeGreaterThan(0);
    expect(firstLevel.key).toEqual('Phenotypic abnormality (HP:0000118)');
    expect(firstLevel.title).toEqual('Phenotypic abnormality (HP:0000118)');
    expect(firstLevel.children.length).toEqual(2);
    expect(firstLevel.results).toEqual(492);
  });

  it('should create sublevels', () => {
    let firstLevel = newStore.tree[0];
    let firstChild = firstLevel.children[0];
    expect(firstChild.key).toEqual(
      'Phenotypic abnormality (HP:0000118)-Abnormality of the nervous system (HP:0000707)',
    );
    expect(firstChild.children.length).toEqual(2);
    expect(firstChild.children[0].title).toEqual(
      'Abnormality of nervous system physiology (HP:0012638)',
    );
    expect(firstChild.children[0].key).toEqual(
      'Phenotypic abnormality (HP:0000118)-Abnormality of the nervous system (HP:0000707)-Abnormality of nervous system physiology (HP:0012638)',
    );
  });

  it('should add the same phenotypes on different parent and sublevels', () => {
    let firstLevel = newStore.tree[0]; // Phenotypic abnormality (HP:0000118)
    let secondChild = firstLevel.children[0];
    let thirdChild = secondChild.children[1];
    let commonAncestor = thirdChild.children[0];

    expect(firstLevel.key).toEqual('Phenotypic abnormality (HP:0000118)');
    expect(secondChild.title).toEqual('Abnormality of the nervous system (HP:0000707)');
    expect(thirdChild.title).toEqual('Abnormality of nervous system morphology (HP:0012639)');
    expect(commonAncestor.title).toEqual(
      'Morphological abnormality of the central nervous system (HP:0002011)',
    );

    // check first insertion
    let firstOccurenceParent = commonAncestor.children[0].children[0]; // Abnormality of the eye (HP:0000478)
    let firstOccurence = firstOccurenceParent.children[0]; // Abnormal eye physiology (HP:0012373)

    expect(firstOccurenceParent.title).toEqual(
      'Abnormality of the cerebral ventricles (HP:0002118)',
    );
    expect(firstOccurence.title).toEqual('Hydrocephalus (HP:0000238)');

    // check second insertion
    let secondOccurenceParent = commonAncestor.children[1]; // Abnormality of the eye (HP:0000478)
    let secondOccurence = secondOccurenceParent.children[0]; // Abnormal eye physiology (HP:0012373)

    expect(secondOccurenceParent.title).toEqual(
      'Abnormality of the cerebrospinal fluid (HP:0002921)',
    );
    expect(secondOccurence.title).toEqual('Hydrocephalus (HP:0000238)');
  });

  it('should add the phenotype to a parent that was enter later in the tree', () => {
    let firstLevel = newStore.tree[0]; // Phenotypic abnormality (HP:0000118)
    let secondChild = firstLevel.children[1]; // Abnormality of the eye (HP:0000478)
    let thirdChild = secondChild.children[0]; // Abnormal eye physiology (HP:0012373)

    expect(firstLevel.key).toEqual('Phenotypic abnormality (HP:0000118)');
    expect(secondChild.title).toEqual('Abnormality of the eye (HP:0000478)');
    expect(thirdChild.title).toEqual('Abnormal eye physiology (HP:0012373)');
  });

  it('should have as much element as item multiply by parents', () => {
    // Count how many possible occurence
    const sumOfTotalInsert = newStore.phenotypes
      .map(p => (p.top_hits.parents.length > 1 ? p.top_hits.parents.length : 1))
      .reduceRight((p, c, i, s) => p + c);
    expect(sumOfTotalInsert).toEqual(21);

    // Validate that all occurence has been added to the tree
    let insertedElements = 0;
    const computeOccurentInTree = (node: TreeNode[]) => {
      node.forEach(p => {
        insertedElements++;
        if (p.children.length > 0) {
          computeOccurentInTree(p.children);
        }
      });
    };
    computeOccurentInTree(newStore.tree);
    expect(insertedElements).toEqual(21);
  });

  it('should remove the default root node named Phenotypic abnormality (HP:0000118)', () => {
    const data = newStore.remoteSingleRootNode(flatMockData);
    expect(data.length).toEqual(flatMockData.length - 1);
    expect(data[1].top_hits.parents).toBeEmpty;
  });

  it('should remove the default root node named Phenotypic abnormality (HP:0000118) from parents', () => {
    const data = newStore.remoteSingleRootNode(flatMockData);
    expect(data.length).toEqual(flatMockData.length - 1);
    expect(data[1].top_hits.parents).toBeEmpty;
  });

  describe('when I ask for a node and I only have a key', () => {
    it('should return the single note for that key', () => {
      // Count how many possible occurence
      const key =
        'Phenotypic abnormality (HP:0000118)-Abnormality of the nervous system (HP:0000707)-Abnormality of nervous system physiology (HP:0012638)';
      const node = newStore.getTreeNodeForKey(key);
      expect(node.key).toEqual(key);
    });
  });
  describe('when request all node children key', () => {
    it('should return a list of all children keys', () => {
      // Count how many possible occurence
      const key =
        'Phenotypic abnormality (HP:0000118)-Abnormality of the eye (HP:0000478)-Abnormal eye physiology (HP:0012373)-Abnormality of vision (HP:0000504)';
      const node = newStore.getTreeNodeForKey(key);
      const childrenkeys = newStore.getChildrenKeys(node, true);
      expect(childrenkeys).toContain(
        'Phenotypic abnormality (HP:0000118)-Abnormality of the eye (HP:0000478)-Abnormal eye physiology (HP:0012373)-Abnormality of vision (HP:0000504)-Visual impairment (HP:0000505)',
      );
      expect(childrenkeys).toContain(
        'Phenotypic abnormality (HP:0000118)-Abnormality of the eye (HP:0000478)-Abnormal eye physiology (HP:0012373)-Abnormality of vision (HP:0000504)-Visual impairment (HP:0000505)-Reduced visual acuity (HP:0007663)',
      );
    });
  });
});
