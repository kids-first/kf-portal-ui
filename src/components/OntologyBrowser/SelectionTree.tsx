import * as React from 'react';
import { Component, Fragment } from 'react';
import { Input, Tag, Tree } from 'antd';
import { TreeNode } from './store';

import './SelectionTree.css';

type SelectionTreeProps = {
  dataSource: TreeNode[];
  checkedKeys: Array<string>;
  onItemSelect: Function;
  targetKeys: Array<string>;
};

type SelectionTreeState = {
  treeData: TreeNode[];
  expandedKeys: string[];
};

const AUTO_EXPAND_TREE = 2;
const MIN_SEARCH_TEXT_LENGTH = 3;

const getInitialKeysForExpand = (data: TreeNode[], collectedKeys: string[] = [], counter = 1) => {
  if (counter < AUTO_EXPAND_TREE) {
    data.forEach(node => {
      counter++;
      collectedKeys.push(node.key);
      if (node.children) {
        getInitialKeysForExpand(node.children, collectedKeys, counter);
      }
    });
  }
  return collectedKeys;
};

export class SelectionTree extends Component<SelectionTreeProps, SelectionTreeState> {
  state = {
    treeData: [],
    expandedKeys: [],
  };

  componentDidMount() {
    const { dataSource } = this.props;
    this.setState({
      treeData: dataSource,
      expandedKeys: getInitialKeysForExpand(dataSource),
    });
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
          text: title,
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
    const hits: string[] = []

    if(e.target.value.length >= MIN_SEARCH_TEXT_LENGTH){
      treeData
        .forEach(node => this.searchInTree(e.target.value, node, hits))

      this.setState({
        treeData:treeData,
        expandedKeys: hits,
      })
    } else {
      treeData
        .forEach(node => this.showAll(node))
      this.setState({
        treeData: treeData,
        expandedKeys: getInitialKeysForExpand(treeData),
      });
    }
  };

  searchInTree = (searchText: string, treeNode: TreeNode, hitTreeNodes: string[] = []) => {
    const cleanSearchText = searchText.replace(/[-/\\^$*+?.()|[\]{}]/g, '');
    const regex = new RegExp('\\b(\\w*' + cleanSearchText + '\\w*)\\b', 'gi');
    const text = treeNode.text;
    const result = text.search(regex) >= 0;
    let match = cleanSearchText === '' || result;

    if (treeNode.children.length > 0) {
      let matchChild = cleanSearchText === '' || false;
      treeNode.children.forEach((child: TreeNode) => {
        if (this.searchInTree(cleanSearchText, child, hitTreeNodes)) {
          matchChild = true;
        }
      });
      match = matchChild || match;
    }
    treeNode.hidden = !match;

    if(!treeNode.hidden) {
      hitTreeNodes.push(treeNode.key)
      if(result) {
        const [ before, hit, after ] = treeNode.text.split(regex)
        treeNode.title = <span>{before}<b>{hit}</b>{after}</span>
      }
    }
    return match;
  };

  showAll = (treeNode: TreeNode) => {
    treeNode.hidden = false
    treeNode.title = treeNode.text

    if (treeNode.children.length > 0) {
      treeNode.children.forEach((child: TreeNode) => {
          this.showAll(child)
      });
    }
    return null;
  };

  onExpand = (expand: (string | number)[], info: Object) => {
    this.setState({
      expandedKeys: expand.map(v => v.toString()),
    });
  };

  render() {
    const { checkedKeys, dataSource, onItemSelect, targetKeys } = this.props;
    const { expandedKeys } = this.state;
    return (
      <Fragment>
          <Input
            style={{ marginBottom: 8, position: 'sticky', top: 0, zIndex: 2 }}
            placeholder="Search for ontology term - Min 3 characters"
            onChange={e => this.onChange(e, dataSource)}
            allowClear
          />
          <Tree
            className="hide-file-icon"
            treeData={this.generateTree(dataSource, targetKeys)}
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
            expandedKeys={expandedKeys}
            onExpand={this.onExpand}
          />
      </Fragment>
    );
  }
}
