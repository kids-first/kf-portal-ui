/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import './sunburst.css';
import { Tree } from 'antd';
import { TreeNode } from '../../../OntologyBrowser/Model';

type OwnProps = {
  treeData: TreeNode[];
  expandedKeys: string[];
};

const InfoPanelNavTree: FunctionComponent<OwnProps> = ({ treeData, expandedKeys }) => (
  <Tree
    treeData={treeData}
    expandedKeys={expandedKeys}
    switcherIcon={<div />}
    style={{ background: '#F3F4F6' }}
    className={'sunburst-phenotypes-tree'}
  />
);

export default InfoPanelNavTree;
