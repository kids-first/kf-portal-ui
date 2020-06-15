import * as React from 'react';
import { Empty, Modal, Result, Transfer } from 'antd';
import { RenderResult, TransferItem } from 'antd/lib/transfer';
import findIndex from 'lodash/findIndex';
import { SelectionTree } from './SelectionTree';
import { PhenotypeStore, TreeNode } from './store';
import { Spinner } from 'uikit/Spinner';
import { isSqonFilter, Sqon, SqonFilters } from 'store/sqon';
import { BranchesOutlined, UserOutlined } from '@ant-design/icons';

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
  treeSource?: TreeNode[];
  targetKeys: string[];
  isLoading: boolean;
  error?: Error | null;
};

const updateSqons = (initialSqon: Sqon, value: string[], selectedField: string) => {
  if (initialSqon.content as SqonFilters[]) {
    const content = initialSqon.content as SqonFilters[];
    const index = findIndex(content, (c) => c.content.field === selectedField);
    if (index >= 0 && value.length === 0) {
      initialSqon.content.splice(index, 1);
    } else if (index >= 0) {
      const valueContent = initialSqon.content[index] as SqonFilters;
      valueContent.content.value = value;
    } else if (value.length > 0) {
      content.push({
        op: 'in',
        content: {
          field: selectedField,
          value,
        },
      });
    }
  }

  return initialSqon;
};

class OntologyModal extends React.Component<ModalProps, ModalState> {
  constructor(props: ModalProps) {
    super(props);
    this.ontologyStore = new PhenotypeStore();
  }

  state: ModalState = {
    selectedKeys: [],
    targetKeys: [],
    isLoading: false,
    error: null,
  };

  transfertDataSource: TransferItem[] = [];

  ontologyStore: PhenotypeStore;

  componentDidMount(): void {
    this.updateData(this.props.selectedField.replace(/\.[^.]*$/, ''));
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

  onApply = (keys: string[]) => {
    const { initialSqon, onSqonUpdate, selectedField } = this.props;
    const valuesId = keys.map(this.getKeyFromTreeId);
    const updatedSqons = updateSqons(initialSqon, valuesId, selectedField);
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
        targetKeys: cleanedTargetKeys,
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

  render() {
    const { isVisible, title } = this.props;
    const { error, targetKeys, isLoading, treeSource } = this.state;
    const dataSource = this.transfertDataSource;
    const hasError = error != null;

    return (
      <Modal
        style={{ height: '80vh', maxWidth: 1400 }}
        title={title + ' Browser'}
        visible={isVisible}
        onOk={() => this.onApply(targetKeys)}
        okText={'Apply'}
        okButtonProps={{ disabled: hasError }}
        onCancel={this.onCancel}
        cancelText="Cancel"
        width="90%"
      >
        {hasError ? (
          <Result
            status="error"
            title="An error occurred"
            subTitle="Please cancel and try again."
          />
        ) : (
          <Transfer
            dataSource={dataSource}
            targetKeys={targetKeys}
            onChange={this.onChange}
            render={(item: TransferItem): RenderResult => item.title || item.key}
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
                const checkedKeys = [...selectedKeys, ...targetKeys];
                return (
                  <SelectionTree
                    dataSource={treeSource || []}
                    onItemSelect={onItemSelect}
                    checkedKeys={checkedKeys}
                    targetKeys={targetKeys}
                    onItemSelectAll={onItemSelectAll}
                  />
                );
              }
            }}
          </Transfer>
        )}
        <div style={{ color: '#515885' }}>
          <UserOutlined /> Participants with this exact term
          <BranchesOutlined style={{ paddingLeft: 20 }} /> Participants including descendant terms
        </div>
      </Modal>
    );
  }
}

export default OntologyModal;
