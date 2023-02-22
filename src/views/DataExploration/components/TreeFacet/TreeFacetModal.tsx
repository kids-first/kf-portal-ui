import { ReactElement, useEffect, useRef, useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { BranchesOutlined, UserOutlined } from '@ant-design/icons';
import Empty from '@ferlab/ui/core/components/Empty';
import { updateActiveQueryField } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { TermOperators } from '@ferlab/ui/core/data/sqon/operators';
import { MERGE_VALUES_STRATEGIES } from '@ferlab/ui/core/data/sqon/types';
import { findSqonValueByField, removeFieldFromSqon } from '@ferlab/ui/core/data/sqon/utils';
import { Button, Col, Dropdown, Menu, Modal, Row, Spin, Tooltip, Transfer, Tree } from 'antd';
import { INDEXES } from 'graphql/constants';
import useParticipantResolvedSqon from 'graphql/participants/useParticipantResolvedSqon';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';
import {
  getFlattenTree,
  removeSameTerms,
  TreeNode,
  TTitleFormatter,
} from 'views/DataExploration/utils/OntologyTree';
import { PhenotypeStore } from 'views/DataExploration/utils/PhenotypeStore';

import { useRemote } from 'store/remote';
import { remoteSliceActions } from 'store/remote/slice';
import { RemoteComponentList } from 'store/remote/types';

import { findChildrenKey, generateTree, getExpandedKeys, isChecked, searchInTree } from './helpers';

import styles from './index.module.scss';

const AUTO_EXPAND_TREE = 1;
const MIN_SEARCH_TEXT_LENGTH = 3;

type Props = {
  type: RemoteComponentList;
  modalField: string;
  queryBuilderField: string;
  titleFormatter?: TTitleFormatter;
};

const TreeFacetModal = ({ type, modalField, queryBuilderField, titleFormatter }: Props) => {
  const dispatch = useDispatch();
  const { visible } = useRemote(type);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const phenotypeStore = useRef(new PhenotypeStore());
  const [rootNode, setRootNode] = useState<TreeNode>();
  const [treeData, setTreeData] = useState<TreeNode>();
  const { sqon } = useParticipantResolvedSqon(DATA_EXPLORATION_QB_ID);

  const getInitialExpandedKeys = (data: TreeNode[], collectedKeys: string[] = [], counter = 0) => {
    if (counter < AUTO_EXPAND_TREE) {
      data.forEach((node) => {
        counter++;
        collectedKeys.push(node.key);
        if (node.children) {
          getInitialExpandedKeys(node.children, collectedKeys, counter);
        }
      });
    }
    return collectedKeys;
  };

  const checkKeys = (
    key: string | number,
    dataSource = treeData ? [treeData] : [],
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
        checkKeys(key, o.children, accu);

        if (accu.check.length > 0) {
          accu.halfcheck.push(o.key);
        }
      }
    });
    return accu;
  };

  const onCheckOrSelect = (
    onItemSelect: any,
    key: string,
    checkedKeys: string[],
    children: TreeNode[],
  ) => {
    const hasChildAlreadyChecked = findChildrenKey(checkedKeys, children);
    onItemSelect(key.toString(), !isChecked(checkedKeys, key.toString()));
    setTargetKeys(removeSameTerms([], hasChildAlreadyChecked ? [key] : [...checkedKeys, key]));
  };

  const handleCancel = () => {
    dispatch(
      remoteSliceActions.openRemoteComponent({
        id: type,
        props: {
          visible: false,
        },
      }),
    );
    setTreeData(undefined);
    setRootNode(undefined);
  };

  const handleOnApply = (operator: TermOperators = TermOperators.in) => {
    const flatTreeData = getFlattenTree(treeData!);
    const results = flatTreeData
      .filter(({ key }) => targetKeys.includes(key))
      .map(({ title }) => title);

    if (!results || results.length === 0) {
      setExpandedKeys(getInitialExpandedKeys([treeData!]));
      updateActiveQueryField({
        queryBuilderId: DATA_EXPLORATION_QB_ID,
        field: queryBuilderField,
        value: [],
        remoteComponent: {
          id: type,
          props: {
            visible: true,
            field: modalField,
          },
        },
      });
    } else {
      updateActiveQueryField({
        queryBuilderId: DATA_EXPLORATION_QB_ID,
        field: queryBuilderField,
        value: results,
        operator,
        index: INDEXES.PARTICIPANT,
        merge_strategy: MERGE_VALUES_STRATEGIES.OVERRIDE_VALUES,
        remoteComponent: {
          id: type,
          props: {
            visible: true,
            field: modalField,
          },
        },
      });
    }

    dispatch(
      remoteSliceActions.openRemoteComponent({
        id: type,
        props: {
          visible: false,
        },
      }),
    );
  };

  useEffect(() => {
    if (visible) {
      const filteredParticipantSqon = removeFieldFromSqon(queryBuilderField, sqon);

      setIsLoading(true);
      phenotypeStore.current
        .fetch({
          field: modalField,
          sqon: filteredParticipantSqon,
          titleFormatter,
        })
        .then(() => {
          const rootNode = phenotypeStore.current.getRootNode()!;

          setIsLoading(false);

          if (rootNode) {
            setTreeData(rootNode);
            setRootNode(rootNode);

            const flatTree = getFlattenTree(rootNode!);
            const selectedValues = findSqonValueByField(queryBuilderField, sqon);

            if (selectedValues) {
              const targetKeys = flatTree
                .filter(({ title }) => selectedValues.includes(title))
                .map(({ key }) => key);

              setExpandedKeys(getExpandedKeys(targetKeys));
              setTargetKeys(removeSameTerms([], targetKeys));
            } else {
              setExpandedKeys(getInitialExpandedKeys([rootNode!]));
              setTargetKeys([]);
            }
          }
        });
    }

    // eslint-disable-next-line
  }, [visible]);

  return (
    <Modal
      visible={visible}
      wrapClassName={styles.hpoTreeModalWrapper}
      className={styles.hpoTreeModal}
      title={intl.get(`screen.dataExploration.${type}.modal.title`)}
      okText={intl.get(`screen.dataExploration.${type}.modal.okText`)}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Dropdown.Button
          key="treeFacet-footer-dropdown-button"
          type="primary"
          overlay={
            <Menu
              onClick={(e) => handleOnApply(e.key as TermOperators)}
              items={[
                {
                  key: TermOperators.in,
                  label: 'Any of',
                },
                {
                  key: TermOperators.all,
                  label: 'All of',
                },
                {
                  key: TermOperators['some-not-in'],
                  label: 'None of',
                },
              ]}
            />
          }
          style={{ marginLeft: '8px' }}
          onClick={() => handleOnApply(TermOperators.in)}
        >
          Apply
        </Dropdown.Button>,
      ]}
      okButtonProps={{ disabled: isEmpty(targetKeys) && isEmpty(treeData) }}
      onOk={() => handleOnApply()}
      onCancel={handleCancel}
    >
      <Transfer<TreeNode>
        className={styles.hpoTransfer}
        showSearch={!isEmpty(treeData)}
        targetKeys={targetKeys}
        selectedKeys={[]}
        oneWay
        onChange={(targetKeys, direction) => {
          if (direction === 'left') {
            setTargetKeys(targetKeys);
          }
        }}
        onSearch={(_, value) => {
          if (value && value.length > MIN_SEARCH_TEXT_LENGTH) {
            const hits: string[] = [];
            const tree = cloneDeep(treeData)!;
            searchInTree(value, tree, hits);
            setExpandedKeys(hits);
            setTreeData(tree);
          } else {
            setExpandedKeys(getInitialExpandedKeys([rootNode!]));
            setTreeData(rootNode);
          }
        }}
        locale={{
          searchPlaceholder: intl.get(`screen.dataExploration.${type}.searchPlaceholder`),
          notFoundContent: (
            <Empty
              imageType="grid"
              description={intl.get(`screen.dataExploration.${type}.emptySelection`)}
            />
          ),
        }}
        filterOption={(inputValue, item) => item.title.indexOf(inputValue) !== -1}
        onSelectChange={(s, t) => {
          setTargetKeys(
            removeSameTerms(
              [],
              targetKeys.filter((el) => !t.includes(el)),
            ),
          );
        }}
        dataSource={treeData ? getFlattenTree(treeData) : []}
        render={(item) =>
          (titleFormatter ? titleFormatter(item.title) : item.title) as ReactElement
        }
        showSelectAll={false}
        operationStyle={{ visibility: 'hidden', width: '5px' }}
      >
        {({ direction, onItemSelect, selectedKeys }) => {
          if (direction === 'left') {
            const checkedKeys = [...removeSameTerms(selectedKeys, targetKeys)];
            const halfCheckedKeys = checkedKeys
              .map((k) => checkKeys(k))
              .flatMap((k) => k.halfcheck);
            return (
              <Spin spinning={isLoading}>
                {isEmpty(treeData) ? (
                  <Empty imageType="grid" />
                ) : (
                  <>
                    <Row justify="space-between" className={styles.phenotypeTreeHeader}>
                      <Col></Col>
                      <Col>
                        <Row style={{ width: 100 }}>
                          <Col span={12} className={styles.phenotypeTreeCountTag}>
                            <Tooltip title={intl.get(`screen.dataExploration.${type}.tags.exact`)}>
                              <UserOutlined />
                            </Tooltip>
                          </Col>
                          <Col span={12} className={styles.phenotypeTreeCountTag}>
                            <Tooltip title={intl.get(`screen.dataExploration.${type}.tags.all`)}>
                              <BranchesOutlined />
                            </Tooltip>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Tree
                      checkable
                      checkStrictly
                      height={600}
                      expandedKeys={expandedKeys}
                      onExpand={(keys) => setExpandedKeys(keys as string[])}
                      checkedKeys={{
                        checked: checkedKeys,
                        halfChecked: halfCheckedKeys,
                      }}
                      titleRender={(node) => node.name}
                      treeData={treeData ? generateTree([treeData], checkedKeys) : []}
                      onCheck={(_, { node: { key, children } }) =>
                        onCheckOrSelect(
                          onItemSelect,
                          key as string,
                          checkedKeys,
                          children as TreeNode[],
                        )
                      }
                      onSelect={(_, { node: { key, children } }) =>
                        onCheckOrSelect(
                          onItemSelect,
                          key as string,
                          checkedKeys,
                          children as TreeNode[],
                        )
                      }
                    />
                  </>
                )}
              </Spin>
            );
          }
        }}
      </Transfer>
    </Modal>
  );
};

export default TreeFacetModal;
