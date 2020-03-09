import * as React from 'react';
import { Fragment } from 'react';
import { Tag, Tree } from 'antd';
import { TreeNode } from './store';

import './SelectionTree.css';

const generateTree2 = (
  treeNodes: TreeNode[] = [],
  checkedKeys: Array<string> = [],
  disabled: boolean = false,
): TreeNode[] =>
  treeNodes.map(({ children, key, title, results }) => {
    const renderedTitle = (
      <Fragment>
        <span>{title}</span>
        <Tag className="label-document-count">{results}</Tag>
      </Fragment>
    );

    const isDisabled = checkedKeys.includes(key || '') || disabled;
    return {
      key: key,
      title: renderedTitle,
      disabled: isDisabled,
      children: generateTree2(children, checkedKeys, isDisabled),
      hasChildren: true,
      results: 324,
    };
  });

const isChecked = (selectedKeys: Array<string>, eventKey: string | number) =>
  selectedKeys.indexOf(eventKey.toString()) !== -1;

export const SelectionTree = ({
  dataSource,
  checkedKeys,
  onItemSelect,
  targetKeys,
}: {
  dataSource: TreeNode[];
  checkedKeys: Array<string>;
  onItemSelect: Function;
  targetKeys: Array<string>;
}) => (
  <Tree
    className="hide-file-icon"
    treeData={generateTree2(dataSource, targetKeys)}
    defaultExpandAll
    showLine
    showIcon={false}
    checkable
    onCheck={(_, { node: { key } }) => {
      onItemSelect(key, !isChecked(checkedKeys, key));
    }}
    checkedKeys={checkedKeys}
    onSelect={(_, { node: { key } }) => {
      onItemSelect(key, !isChecked(checkedKeys, key));
    }}
  />
);
