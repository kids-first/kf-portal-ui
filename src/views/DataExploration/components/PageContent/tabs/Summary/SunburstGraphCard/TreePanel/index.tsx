import { Button, Space, Tree, Typography } from 'antd';
import { TreeNode } from 'views/DataExploration/utils/OntologyTree';
import intl from 'react-intl-universal';
import { INDEXES } from 'graphql/constants';
import { RegexExtractPhenotype } from 'views/DataExploration/utils/PhenotypeStore';
import { MERGE_VALUES_STRATEGIES } from '@ferlab/ui/core/data/sqon/types';
import { updateActiveQueryField } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';

import styles from './index.module.scss';

interface OwnProps {
  currentNode: TreeNode;
  treeData: TreeNode[];
  getSelectedPhenotype: (node: TreeNode) => void;
  updateSunburst: (key: string) => void;
  field: string;
}

const { Title, Text } = Typography;

const getExpandedNode = (currentNode: TreeNode): string[] =>
  currentNode?.key.match(RegexExtractPhenotype) || [];

const getSelectedKeys = (currentNode: TreeNode): string[] =>
  [currentNode?.key.match(RegexExtractPhenotype)?.reverse()[0]!] || [];

const getPath = (node: string, treeNodes: TreeNode[], path: string[] = []): string[] => {
  const updatePath = [...path];
  const currentNodeText = treeNodes[0].key;
  updatePath.push(currentNodeText);
  if (node !== currentNodeText) {
    return getPath(node, treeNodes[0].children, updatePath);
  }
  return updatePath;
};

const TreePanel = ({
  currentNode,
  treeData,
  getSelectedPhenotype,
  updateSunburst,
  field,
}: OwnProps) => (
  <Space direction="vertical" className={styles.phenotypeSunburstTree}>
    <Title level={5}>{currentNode?.name}</Title>
    <Text>
      {intl.get(`screen.dataExploration.tabs.summary.${field}.phenotypeTree.nbParticipant`, {
        count: currentNode?.results,
      })}
    </Text>
    <Button
      className={styles.addTermBtn}
      type="link"
      size="small"
      onClick={() => {
        updateActiveQueryField({
          queryBuilderId: DATA_EXPLORATION_QB_ID,
          field: `${field}.name`,
          value: [currentNode?.title!],
          index: INDEXES.PARTICIPANT,
          merge_strategy: MERGE_VALUES_STRATEGIES.APPEND_VALUES,
        });
      }}
    >
      {intl.get(`screen.dataExploration.tabs.summary.${field}.phenotypeTree.addTermToQuery`)}
    </Button>
    <Space className={styles.treeWrapper} direction="vertical" size={5}>
      <Text type="secondary">
        {intl.get(`screen.dataExploration.tabs.summary.${field}.phenotypeTree.currentPath`)}
      </Text>
      <Tree
        height={213}
        switcherIcon={<div />}
        selectedKeys={getSelectedKeys(currentNode!)}
        expandedKeys={getExpandedNode(currentNode!)}
        className={styles.phenotypeTree}
        treeData={treeData!}
        onSelect={(keys) => {
          if (keys.length) {
            const key = getPath(keys[0] as string, treeData!).join('-');
            getSelectedPhenotype({
              title: keys[0] as string,
              name: keys[0] as string,
              key,
              children: [],
              valueText: 0,
            });
            updateSunburst(key);
          } else {
            return {};
          }
        }}
      />
    </Space>
  </Space>
);

export default TreePanel;
