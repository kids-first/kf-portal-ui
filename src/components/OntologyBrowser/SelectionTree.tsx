import * as React from 'react';
import { Component, Fragment } from 'react';
import { BranchesOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Tree } from 'antd';

import { TreeNode } from './Model';
import TermCounts from './TermCounts';

import './SelectionTree.css';

type SelectionTreeProps = {
  dataSource: TreeNode[];
  checkedKeys: Array<string>;
  onItemSelect: Function;
  targetKeys: Array<string>;
  onItemSelectAll: Function;
  selectedField: String;
};

type SelectionTreeState = {
  treeData: TreeNode[];
  expandedKeys: string[];
};

const AUTO_EXPAND_TREE = 2;
const MIN_SEARCH_TEXT_LENGTH = 3;

const getInitialKeysForExpand = (data: TreeNode[], collectedKeys: string[] = [], counter = 1) => {
  if (counter < AUTO_EXPAND_TREE) {
    data.forEach((node) => {
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
    checkedKeys: string[] = [],
    targetKeys: string[] = [],
    treeDisabled: boolean = false,
  ): TreeNode[] =>
    treeNodes
      .map(({ children, key, title, results, hidden, exactTagCount, disabled }: TreeNode) => {
        const renderedTitle = (
          <TermCounts title={title} exactTagCount={exactTagCount} results={results} />
        );
        const isDisabled = targetKeys.includes(key || '') || treeDisabled;
        const childrenShouldBeDisabled = checkedKeys.includes(key) || isDisabled;
        return {
          key: key,
          title: renderedTitle,
          text: title,
          disabled: isDisabled || disabled,
          children: this.generateTree(children, checkedKeys, targetKeys, childrenShouldBeDisabled),
          hasChildren: true,
          results: 324,
          hidden,
        } as TreeNode;
      })
      .filter((node) => (node.hidden ? false : !node.hidden));

  isChecked = (selectedKeys: Array<string>, eventKey: string | number) =>
    selectedKeys.indexOf(eventKey.toString()) !== -1;

  onChange = (e: React.ChangeEvent<HTMLInputElement>, treeData: TreeNode[]) => {
    const hits: string[] = [];
    let newExpandNode: string[] = [];

    if (e.target.value.length >= MIN_SEARCH_TEXT_LENGTH) {
      treeData.forEach((node) => this.searchInTree(e.target.value, node, hits));
      newExpandNode = hits;
    } else {
      treeData.forEach((node) => this.showAll(node));
      newExpandNode = getInitialKeysForExpand(treeData);
    }

    this.setState({
      treeData: treeData,
      expandedKeys: newExpandNode,
    });
  };

  searchInTree = (searchText: string, treeNode: TreeNode, hitTreeNodes: string[] = []) => {
    const cleanSearchText = searchText.replace(/[-/\\^$*+?.()|[\]{}]/g, '');
    const regex = new RegExp('\\b(\\w*' + cleanSearchText + '\\w*)\\b', 'gi');
    const text = treeNode.text;
    const key = treeNode.key;
    const result = text.search(regex) >= 0;
    const resultKey = key.search(regex) >= 0;
    let match = cleanSearchText === '' || result || resultKey;

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

    if (!treeNode.hidden) {
      hitTreeNodes.push(treeNode.key);
      if (result || resultKey) {
        const [before, hit, after] = treeNode.text.split(regex);
        if (hit) {
          treeNode.title = (
            <span>
              {before}
              <div className={'highlight'} style={{ display: 'inherit' }}>
                {hit}
              </div>
              {after}
            </span>
          );
        }
      }
    }
    return match;
  };

  showAll = (treeNode: TreeNode) => {
    treeNode.hidden = false;
    treeNode.title = treeNode.text;

    if (treeNode.children.length > 0) {
      treeNode.children.forEach((child: TreeNode) => {
        this.showAll(child);
      });
    }
  };

  onExpand = (expand: (string | number)[]) => {
    this.setState({
      expandedKeys: expand.map((v) => v.toString()),
    });
  };

  checkKeys = (
    key: string | number,
    dataSource = this.props.dataSource,
    accu: { check: string[]; halfcheck: string[] } = {
      check: [],
      halfcheck: [],
    },
  ) => {
    dataSource.forEach((o) => {
      if (o.key === key) {
        return accu.check.push(o.key);
      }

      if (accu.check.length === 0) {
        this.checkKeys(key, o.children, accu);

        if (accu.check.length > 0) {
          accu.halfcheck.push(o.key);
        }
      }
    });
    return accu;
  };

  render() {
    const {
      checkedKeys,
      dataSource,
      onItemSelect,
      targetKeys,
      onItemSelectAll,
      selectedField, //todo to be removed when mondo search is fixed
    } = this.props;
    const { expandedKeys } = this.state;
    const halfCheckedKeys = new Set(
      checkedKeys.map((k) => this.checkKeys(k)).flatMap((k) => k.halfcheck),
    );
    return (
      <Fragment>
        <Col style={{ position: 'sticky', top: 0, zIndex: 2, backgroundColor: '#fff' }}>
          <Row>
            {selectedField !== 'diagnoses.mondo.name' ? ( //todo remove when mondo search is fixed
              <Input
                className="custom-input"
                placeholder="Search for ontology term - Min 3 characters"
                onChange={(e) => this.onChange(e, dataSource)}
                allowClear
                size="large"
              />
            ) : (
              ''
            )}
          </Row>
          <Row justify="space-between">
            <Col>
              <Button
                type="link"
                onClick={(e) => {
                  e.preventDefault();
                  onItemSelectAll(checkedKeys, false);
                }}
              >
                Clear
              </Button>
            </Col>
            <Col className={'flex-align-items-center'} style={{ paddingRight: 4 }}>
              <Row style={{ width: 100 }}>
                <Col span={12} className={'flex-center'}>
                  <UserOutlined className={'text-color-TO-DELETE'} />
                </Col>
                <Col span={12} className={'flex-center'}>
                  <BranchesOutlined className={'text-color-TO-DELETE'} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Tree
          className="hide-file-icon ant-tree-custom-TO-DELETE"
          treeData={this.generateTree(dataSource, checkedKeys, targetKeys)}
          defaultExpandAll
          selectedKeys={[]}
          showLine
          showIcon={false}
          checkable
          onCheck={(_, { node }) => {
            const isChecked = !this.isChecked(checkedKeys, node.key);
            this.checkKeys(node.key);
            onItemSelect(node.key, isChecked);
          }}
          checkedKeys={{
            checked: checkedKeys,
            halfChecked: Array.from(halfCheckedKeys),
          }}
          onSelect={(_, { node: { key } }) => {
            onItemSelect(key, !this.isChecked(checkedKeys, key));
          }}
          expandedKeys={expandedKeys}
          onExpand={this.onExpand}
          checkStrictly
        />
      </Fragment>
    );
  }
}
