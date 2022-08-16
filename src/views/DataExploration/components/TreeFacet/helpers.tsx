import { TreeNode } from 'views/DataExploration/utils/OntologyTree';
import TreeNodeTitle from './TreeNodeTitle';
import { Typography } from 'antd';

import styles from './index.module.scss';

export const isChecked = (selectedKeys: string[], eventKey: string) =>
  selectedKeys.indexOf(eventKey) !== -1;

export const findChildrenKey = (checkedKeys: string[], node: TreeNode[]): boolean =>
  node.some(
    ({ key, children }) => checkedKeys.includes(key) || findChildrenKey(checkedKeys, children),
  );

export const generateTree = (
  treeNodes: TreeNode[] = [],
  checkedKeys: string[] = [],
  disabledTree: boolean = false,
): TreeNode[] =>
  treeNodes
    .map(({ children, ...props }) => {
      const isDisabled = checkedKeys.includes(props.key) || disabledTree;
      return {
        ...props,
        name: (
          <TreeNodeTitle
            title={props.name}
            exactTagCount={props.exactTagCount || 0}
            totalCount={props.results || 0}
          />
        ),
        disabled: isDisabled,
        children: generateTree(children, checkedKeys, isDisabled),
      };
    })
    .filter((node) => (node.hidden ? false : !node.hidden));

export const getExpandedKeys = (targetKeys: string[]) => {
  let keys: string[] = [];

  targetKeys.forEach((key) => {
    const parentKey = key.substring(0, key.lastIndexOf('-'));

    if (parentKey.indexOf('-') !== -1) {
      keys = keys.concat(getExpandedKeys([parentKey]));
    }

    keys.push(parentKey);
  });

  return keys;
};

export const searchInTree = (
  searchText: string,
  treeNode: TreeNode,
  hitTreeNodes: string[] = [],
) => {
  const cleanSearchText = searchText.replace(/[-/\\^$*+?.()|[\]{}]/g, '');
  const regex = new RegExp('\\b(\\w*' + cleanSearchText + '\\w*)\\b', 'gi');
  const text = treeNode.title;
  const key = treeNode.key;
  const result = text.search(regex) >= 0;
  const resultKey = key.search(regex) >= 0;
  let match = cleanSearchText === '' || result || resultKey;

  if (treeNode.children.length > 0) {
    let matchChild = cleanSearchText === '' || false;
    treeNode.children.forEach((child: TreeNode) => {
      if (searchInTree(cleanSearchText, child, hitTreeNodes)) {
        matchChild = true;
      }
    });
    match = matchChild || match;
  }
  treeNode.hidden = !match;

  if (!treeNode.hidden) {
    hitTreeNodes.push(treeNode.key);

    if (result || resultKey) {
      const [before, hit, after] = treeNode.title.split(regex);
      if (hit) {
        treeNode.name = (
            <Typography.Text>
              {before}
              <div className={styles.highlight}>{hit}</div>
              {after}
            </Typography.Text>
        );
      }
    }
  }
  return match;
};
