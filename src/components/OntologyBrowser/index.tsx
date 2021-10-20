import * as React from 'react';
import { BranchesOutlined, UserOutlined } from '@ant-design/icons';
//@ts-ignore
import ExtendedMappingProvider from '@kfarranger/components/dist/utils/ExtendedMappingProvider';
// @ts-ignore
import { ALL_OP, IN_OP, SOME_NOT_IN_OP } from '@kfarranger/middleware/dist/constants';
import { Button, Dropdown, Empty, Menu, Modal, Result, Transfer } from 'antd';
import { RenderResult, TransferItem } from 'antd/lib/transfer';
import { cloneDeep } from 'lodash';
import findIndex from 'lodash/findIndex';

import { arrangerApiProjectId } from 'common/injectGlobals';
import { ARRANGER_API_PARTICIPANT_INDEX_NAME } from 'components/CohortBuilder/common';
import { TreeNode } from 'components/OntologyBrowser/Model';
import { SelectionTree } from 'components/OntologyBrowser/SelectionTree';
import { PhenotypeStore, removeSameTerms, selectSameTerms } from 'components/OntologyBrowser/store';
import { IntersectionIcon } from 'icons/IntersectionIcon';
import { NotEqualIcon } from 'icons/NotEqualIcon';
import { UnionIcon } from 'icons/UnionIcon';
import { isSqonFilter, Sqon, SqonFilters } from 'store/sqon';
import { Spinner } from 'uikit/Spinner';
import { getFieldDisplayName } from 'utils';

import './index.css';

type ModalProps = {
  isVisible: boolean;
  onCloseModal: Function;
  initialSqon: Sqon;
  onSqonUpdate: Function;
  title: string;
  selectedField: string;
};

type ModalState = {
  selectedKeys: string[];
  selectedOperator: string;
  treeSource?: TreeNode[];
  targetKeys: string[];
  isLoading: boolean;
  error?: Error | null;
};

const desactivateAllSameTerms = (allSameTerms: string[], transferItems: TransferItem[]) =>
  transferItems.map((t) => {
    if (allSameTerms.includes(t.key as string)) {
      return Object.assign(t, { disabled: true });
    } else if (t.disabled) {
      return Object.assign(t, { disabled: !t.disabled });
    } else return t;
  });

const OPERATIONS = [
  {
    name: 'Any of',
    // eslint-disable-next-line react/display-name
    component: (fill: string) => <UnionIcon fill={fill} />,
    operation: IN_OP,
  },
  {
    name: 'All of',
    // eslint-disable-next-line react/display-name
    component: (fill: string) => <IntersectionIcon fill={fill} />,
    operation: ALL_OP,
  },
  {
    name: 'Not',
    // eslint-disable-next-line react/display-name
    component: (fill: string) => <NotEqualIcon fill={fill} />,
    operation: SOME_NOT_IN_OP,
  },
];

const getOperation = (name: string) =>
  OPERATIONS.find((s) => s.operation.toLowerCase() === name.toLowerCase());

const getOperationByName = (name: string) =>
  OPERATIONS.find((s) => s.name.toLowerCase() === name.toLowerCase());

export const updateSqons = (
  initialSqon: Sqon,
  value: string[],
  selectedField: string,
  operator: string,
): Sqon => {
  const updatedSqon = cloneDeep(initialSqon);
  const updatedContent = updatedSqon.content as SqonFilters[];

  if (updatedSqon.content as SqonFilters[]) {
    const index = findIndex(updatedContent, (c) => c.content.field === selectedField);
    if (index >= 0 && value.length === 0) {
      updatedSqon.content.splice(index, 1);
    } else if (index >= 0) {
      const valueContent = { ...updatedContent[index] } as SqonFilters;
      const newValueSet = new Set(
        Array.isArray(valueContent.content.value)
          ? [...valueContent.content.value, ...value]
          : [...value, valueContent.content.value],
      );
      updatedContent[index].content = { field: selectedField, value: [...Array.from(newValueSet)] };
      updatedContent[index].op = operator;
    } else if (value.length > 0) {
      updatedContent.push({
        op: operator,
        content: {
          field: selectedField,
          value,
        },
      });
      updatedSqon.content = updatedContent;
    }
  }

  return updatedSqon;
};

class OntologyModal extends React.Component<ModalProps, ModalState> {
  constructor(props: ModalProps) {
    super(props);
    this.ontologyStore = new PhenotypeStore();
  }

  state: ModalState = {
    selectedKeys: [],
    selectedOperator: 'in',
    targetKeys: [],
    isLoading: false,
    error: null,
  };

  transfertDataSource: TransferItem[] = [];

  ontologyStore: PhenotypeStore;

  componentDidMount(): void {
    this.updateData(this.props.selectedField.replace(/\.[^.]*$/, ''));
    const content = this.props.initialSqon.content as SqonFilters[];
    if (content.length > 0) {
      this.setState({ selectedOperator: content[0].op });
    }
  }

  getKeyFromTreeId = (treeId: string) => {
    const values = treeId.split('-');
    return values[values.length - 1];
  };

  getKeysFromSqon = (): string[] => {
    const results: any = {};
    const { initialSqon, selectedField } = this.props;

    const content = initialSqon.content as SqonFilters[];
    const filteredContent = content.filter((s) => isSqonFilter(s));

    const findTreeKey = (treeNode: TreeNode) => {
      filteredContent.forEach((v) => {
        if (
          ((v.content?.value || []).indexOf(treeNode.title as string) >= 0 && v.content?.field) ||
          null === selectedField
        ) {
          results[treeNode.title as string] = treeNode.key;
        }

        if (treeNode.children.length > 0) {
          treeNode.children.forEach((t) => findTreeKey(t));
        }
      });
    };
    this.ontologyStore.tree.forEach((treeNode) => {
      findTreeKey(treeNode);
    });
    return Object.values(results);
  };

  closeAndCleanModal = () => {
    this.setState({ error: null });
    this.props.onCloseModal();
  };

  onApply = (keys: string[], operator: string) => {
    const { initialSqon, onSqonUpdate, selectedField } = this.props;
    const valuesId = keys.map(this.getKeyFromTreeId);
    const updatedSqons = updateSqons(initialSqon, valuesId, selectedField, operator);
    onSqonUpdate(updatedSqons);
    this.closeAndCleanModal();
  };

  onCancel = () => {
    this.closeAndCleanModal();
  };

  onChange = (nextTargetKeys: string[], direction: string, moveKeys: string[]) => {
    const { targetKeys } = this.state;

    // Children should be removed from target since only the upper most phenotype should be keep
    let cleanedTargetKeys = nextTargetKeys;
    if (direction === 'right') {
      moveKeys.forEach((mk) => {
        const node = this.ontologyStore.getTreeNodeForKey(mk);
        if (node) {
          const childrenKeys = this.ontologyStore.getChildrenKeys(node, true);
          cleanedTargetKeys = nextTargetKeys.filter((k) => !childrenKeys.includes(k));
        } else {
          cleanedTargetKeys = nextTargetKeys;
        }
      });
      this.setState({
        targetKeys: removeSameTerms(moveKeys, cleanedTargetKeys),
      });
    } else if (direction === 'left') {
      this.setState({
        targetKeys: targetKeys.filter((key) => moveKeys.indexOf(key) < 0),
      });
    }
  };

  flattenDataSource = (list: TransferItem[] = []) => {
    list.forEach((item: TransferItem) => {
      this.transfertDataSource.push(item);
      this.flattenDataSource(item.children);
    });
  };

  updateData = (field: string) => {
    this.setState({ isLoading: true });
    this.ontologyStore
      .fetch(field, this.props.initialSqon)
      .then(() => {
        this.transfertDataSource = [];
        this.flattenDataSource(this.ontologyStore.tree as TransferItem[]);
        const newTargetKeys = this.getKeysFromSqon();
        this.setState({
          treeSource: this.ontologyStore.tree,
          targetKeys: newTargetKeys,
          isLoading: false,
        });
      })
      .catch((error) => {
        this.setState({ isLoading: false, error });
      });
  };

  shouldComponentUpdate(nextProps: ModalProps) {
    const { isVisible } = this.props;
    if (nextProps.isVisible && !isVisible) {
      // opening the modal again
      this.updateData(this.props.selectedField.replace(/\.[^.]*$/, ''));
      return false;
    } else if (!nextProps.isVisible && !isVisible) {
      // Closing the modal
      return false;
    }
    return true;
  }

  isLoadingOrEmpty = (): boolean => this.state.isLoading || this.transfertDataSource.length === 0;

  menu = () => (
    <Menu
      onClick={(e) => {
        this.setState({ selectedOperator: getOperationByName(e.key as string)!.operation });
      }}
    >
      {OPERATIONS.map((s) => (
        <Menu.Item key={s.name.toLowerCase()} icon={s.component('#515885')}>
          {` ${s.name}`}
        </Menu.Item>
      ))}
    </Menu>
  );

  render() {
    const { isVisible, title } = this.props;
    const { error, targetKeys, isLoading, treeSource, selectedOperator } = this.state;
    const hasError = error != null;

    const allSameTerms = selectSameTerms(targetKeys, treeSource);
    const dataSource = this.transfertDataSource;
    const disabledSameTerms = desactivateAllSameTerms(allSameTerms, dataSource);
    const operation = getOperation(selectedOperator)?.operation || IN_OP;

    return (
      <ExtendedMappingProvider
        projectId={arrangerApiProjectId}
        graphqlField={ARRANGER_API_PARTICIPANT_INDEX_NAME}
      >
        {({ extendedMapping = [] }) => (
          <Modal
            className="ontology-modal"
            title={`${getFieldDisplayName(title, extendedMapping)} Browser`}
            visible={isVisible}
            width="90%"
            onCancel={() => this.onCancel()}
            footer={[
              <Button key="cancel" onClick={() => this.onCancel()} style={{ marginRight: 10 }}>
                Cancel
              </Button>,
              <Dropdown.Button
                key="apply"
                disabled={hasError}
                onClick={() => this.onApply(targetKeys, operation)}
                overlay={this.menu}
                type="primary"
                placement="bottomRight"
                icon={getOperation(this.state.selectedOperator)!.component('#ffffff')}
              >
                Apply
              </Dropdown.Button>,
            ]}
          >
            {hasError ? (
              <Result
                status="error"
                title="An error occurred"
                subTitle="Please cancel and try again."
              />
            ) : (
              <Transfer
                className={'transfer-container'}
                dataSource={disabledSameTerms}
                targetKeys={targetKeys}
                onChange={this.onChange}
                render={(item: TransferItem): RenderResult => (item.title || item.key) as string}
                disabled={false}
                showSelectAll={false}
                locale={{
                  notFoundContent: this.isLoadingOrEmpty() ? (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  ) : (
                    'Select items from the panel on the left in order to add them to your query'
                  ),
                }}
              >
                {({ direction, onItemSelect, onItemSelectAll, selectedKeys }) => {
                  if (direction === 'left' && isLoading) {
                    return <Spinner className={'spinner'} size={'large'} />;
                  }
                  if (direction === 'left' && treeSource) {
                    const checkedKeys = [...removeSameTerms(selectedKeys, targetKeys)];
                    return treeSource.length ? (
                      <SelectionTree
                        dataSource={treeSource || []}
                        onItemSelect={onItemSelect}
                        checkedKeys={checkedKeys}
                        targetKeys={targetKeys}
                        onItemSelectAll={onItemSelectAll}
                        selectedField={this.props.selectedField}
                      />
                    ) : (
                      <div className={'empty-container'}>
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description={'There is no observed HPO phenotypes for these participants'}
                        />
                      </div>
                    );
                  }
                }}
              </Transfer>
            )}
            <div className={'text-color-TO-DELETE'}>
              <UserOutlined /> Participants with this exact term
              <BranchesOutlined style={{ paddingLeft: 20 }} /> Participants including descendant
              terms
            </div>
          </Modal>
        )}
      </ExtendedMappingProvider>
    );
  }
}

export default OntologyModal;
