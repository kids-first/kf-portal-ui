import { PhenotypeSource, PhenotypeStore, removeSameTerms, selectSameTerms } from '../store';
import { TreeNode } from '../Model';
import { flatMockData, treeData } from './mockData';

describe('Phenotype Store', () => {
  let newStore: PhenotypeStore;

  beforeAll(() => {
    newStore = new PhenotypeStore();
    newStore.getPhenotypes = jest.fn().mockReturnValue(Promise.resolve(flatMockData));
    return newStore.fetch('field');
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
      'Phenotypic abnormality (HP:0000118)-Abnormality of the nervous system (HP:0000707)-' +
        'Abnormality of nervous system physiology (HP:0012638)',
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
      .map((p) => (p.top_hits.parents.length > 1 ? p.top_hits.parents.length : 1))
      .reduceRight((p, c) => p + c);
    expect(sumOfTotalInsert).toEqual(21);

    // Validate that all occurence has been added to the tree
    let insertedElements = 0;
    const computeOccurentInTree = (node: TreeNode[]) => {
      node.forEach((p) => {
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
    const data = newStore.remoteSingleRootNode(flatMockData as PhenotypeSource[]);
    expect(data.length).toEqual(flatMockData.length - 1);
    expect(data[1].top_hits.parents).toBeEmpty;
  });

  it('should remove the default root node named Phenotypic abnormality (HP:0000118) from parents', () => {
    const data = newStore.remoteSingleRootNode(flatMockData as PhenotypeSource[]);
    expect(data.length).toEqual(flatMockData.length - 1);
    expect(data[1].top_hits.parents).toBeEmpty;
  });

  describe('when I ask for a node and I only have a key', () => {
    it('should return the single note for that key', () => {
      // Count how many possible occurence
      const key =
        'Phenotypic abnormality (HP:0000118)-Abnormality of the nervous system (HP:0000707)-' +
        'Abnormality of nervous system physiology (HP:0012638)';
      const node = newStore.getTreeNodeForKey(key);
      expect(node?.key).toEqual(key);
    });
  });
  describe('when request all node children key', () => {
    it('should return a list of all children keys', () => {
      // Count how many possible occurence
      const key =
        'Phenotypic abnormality (HP:0000118)-Abnormality of the eye (HP:0000478)-' +
        'Abnormal eye physiology (HP:0012373)-Abnormality of vision (HP:0000504)';
      const node = newStore.getTreeNodeForKey(key);
      let childrenkeys: string[] = [];
      if (node) {
        childrenkeys = newStore.getChildrenKeys(node, true);
      }
      expect(childrenkeys).toContain(
        'Phenotypic abnormality (HP:0000118)-Abnormality of the eye (HP:0000478)-' +
          'Abnormal eye physiology (HP:0012373)-Abnormality of vision (HP:0000504)-' +
          'Visual impairment (HP:0000505)',
      );
      expect(childrenkeys).toContain(
        'Phenotypic abnormality (HP:0000118)-Abnormality of the eye (HP:0000478)-' +
          'Abnormal eye physiology (HP:0012373)-Abnormality of vision (HP:0000504)-' +
          'Visual impairment (HP:0000505)-Reduced visual acuity (HP:0007663)',
      );
    });
  });

  it('/removeSameTerms should prohibit selecting multiple times the same term', () => {
    let selecteKeys = ['ONE-two-three (123)'];
    let targetKeys = ['two-ONE-three (123)', 'five-six-seven (567)', 'one-zero-zero (100)'];

    //not expected to change
    const res_one = removeSameTerms(selecteKeys, targetKeys);
    expect(res_one.sort()).toEqual(
      ['two-ONE-three (123)', 'five-six-seven (567)', 'one-zero-zero (100)'].sort(),
    );
    selecteKeys = ['ONE-two-three (123)', 'two-ONE-three (123)'];
    targetKeys = ['five-six-seven (567)', 'one-zero-zero (100)'];

    //expected to add last item change
    const res_two = removeSameTerms(selecteKeys, targetKeys);
    expect(res_two.sort()).toEqual(
      ['two-ONE-three (123)', 'five-six-seven (567)', 'one-zero-zero (100)'].sort(),
    );
  });

  it('/selectSameTerms should return all keys of same terms from tree', () => {
    const selectedKeys = [
      'Abnormality of the integument (HP:0001574)-' +
        'Abnormality of skin adnexa morphology (HP:0011138)-' +
        'Skin appendage neoplasm (HP:0012842)',
    ];
    const res = selectSameTerms(selectedKeys, treeData);
    const output = [
      'Abnormality of the integument (HP:0001574)-Abnormality of the skin (HP:0000951)' +
        '-Abnormality of skin morphology (HP:0011121)' +
        'Skin appendage neoplasm (HP:0012842)',
    ];
    expect(res).toEqual(output);
  });

  describe('when the sum of children is greater than parent', () => {
    it('should not set value on the parent node', () => {
      let firstLevel = newStore.tree[0];
      expect(firstLevel.key).toEqual('Phenotypic abnormality (HP:0000118)');
      expect(firstLevel.valueText).toEqual(874);
      expect(firstLevel.value).toEqual(undefined);
    });
  });

  describe('when the sum of children is lower than parent', () => {
    it('should set value on the parent node equal the parent results minus children sum', () => {
      let firstLevel = newStore.tree[0].children[1];
      expect(firstLevel.key).toEqual(
        'Phenotypic abnormality (HP:0000118)-Abnormality of the eye (HP:0000478)',
      );
      expect(firstLevel.valueText).toEqual(200);
      expect(firstLevel.value).toEqual(66);
    });
  });
});
