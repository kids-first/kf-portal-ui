import * as React from 'react';
import { Component, Fragment } from 'react';
import { Input, Tag, Tree } from 'antd';
import { TreeNode } from './store';

import './SelectionTree.css';
const { Search } = Input;

type SelectionTreeProps = {
  dataSource: TreeNode[];
  checkedKeys: Array<string>;
  onItemSelect: Function;
  targetKeys: Array<string>;
};

type SelectionTreeState = {
  treeData: TreeNode[];
};

export class SelectionTree extends Component<SelectionTreeProps, SelectionTreeState> {
  state = {
    treeData: [],
  };

  componentDidMount() {
    const { dataSource, targetKeys } = this.props;
    this.setState({ treeData: dataSource });
  }

  generateTree = (
    treeNodes: TreeNode[] = [],
    checkedKeys: Array<string> = [],
    disabled: boolean = false,
  ): TreeNode[] => {
    return treeNodes
      .map(({ children, key, title, results, hidden }: TreeNode) => {
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
          children: this.generateTree(children, checkedKeys, isDisabled),
          hasChildren: true,
          results: 324,
          hidden,
        } as TreeNode;
      })
      .filter(node => (node.hidden ? false : !node.hidden));
  };
  isChecked = (selectedKeys: Array<string>, eventKey: string | number) =>
    selectedKeys.indexOf(eventKey.toString()) !== -1;

  onChange = (e: React.ChangeEvent<HTMLInputElement>, treeData: TreeNode[]) => {
    treeData.forEach(node => this.searchInTree(e.target.value, node));
    this.setState({ treeData });
  };

  searchInTree = (searchText: string, treeNode: TreeNode) => {
    const regex = new RegExp(searchText, 'i');
    const text = treeNode.title as string;
    const result = !text.search(regex);
    let match = searchText === '' || result;

    if (treeNode.children.length > 0) {
      let matchChild = searchText === '' || false;
      treeNode.children.forEach((child: TreeNode) => {
        if (this.searchInTree(searchText, child)) {
          matchChild = true;
        }
      });
      match = matchChild || match;
    }

    treeNode.hidden = !match;
    return match;
  };

  render() {
    const { dataSource, checkedKeys, onItemSelect, targetKeys } = this.props;
    const { treeData } = this.state;
    return (
      <Fragment>
        <Search
          style={{ marginBottom: 8 }}
          placeholder="Search"
          onChange={e => this.onChange(e, treeData)}
        />
        <Tree
          className="hide-file-icon"
          treeData={this.generateTree(treeData, targetKeys)}
          defaultExpandAll
          showLine
          showIcon={false}
          checkable
          onCheck={(_, { node: { key } }) => {
            onItemSelect(key, !this.isChecked(checkedKeys, key));
          }}
          checkedKeys={checkedKeys}
          onSelect={(_, { node: { key } }) => {
            onItemSelect(key, !this.isChecked(checkedKeys, key));
          }}
        />
      </Fragment>
    );
  }
}
