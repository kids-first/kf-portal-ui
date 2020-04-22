import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, Transfer, Empty, Result } from 'antd';
import { RenderResult, TransferItem } from 'antd/lib/transfer';
import findIndex from 'lodash/findIndex';
import { SelectionTree } from './SelectionTree';
import { PhenotypeStore, TreeNode } from './store';
import { setSqons } from '../../store/actionCreators/virtualStudies';
import { Spinner } from '../../uikit/Spinner';

import './index.css';

type ModalProps = {
  isVisible: boolean;
  onCloseModal: Function;
  initialSqon: Sqon;
  onSqonUpdate: Function;
  title: string;
  setSqons: Function;
  selectedField: string;
};

type ModalState = {
  selectedKeys: string[];
  treeSource?: TreeNode[];
  targetKeys: string[];
  isLoading: boolean;
  error?: Error | null;
};

type SqonFilters = {
  op: string;
  content: { field: string; value: string[] };
};

type Sqon = {
  op: string;
  content: SqonFilters[];
};

const updateSqons = (initialSqon: Sqon, value: string[]) => {
  const index = findIndex(initialSqon?.content, c => c.content.field === 'observed_phenotype.name');
  if (index >= 0 && value.length === 0) {
    initialSqon.content.splice(index, 1);
  } else if (index >= 0) {
    initialSqon.content[index].content.value = value;
  } else if (value.length > 0) {
    initialSqon.content.push({
      op: 'in',
      content: {
        field: 'observed_phenotype.name',
        value,
      },
    });
  }

  return [initialSqon];
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
    this.updateData();
  }

  getKeyFromTreeId = (treeId: string) => {
    const values = treeId.split('-');
    return values[values.length - 1];
  };

  getKeysFromSqon = (): string[] => {
    const results: any = {};
    const findTreeKey = (treeNode: TreeNode) => {
      const { initialSqon, selectedField } = this.props;
      initialSqon.content.forEach(v => {
        if (
          v.content.value.indexOf(treeNode.title as string) >= 0 &&
          v.content.field === selectedField
        ) {
          results[treeNode.title as string] = treeNode.key;
        }
        if (treeNode.children.length > 0) {
          treeNode.children.forEach(t => findTreeKey(t));
        }
      });
    };
    this.ontologyStore.tree.forEach(treeNode => {
      findTreeKey(treeNode);
    });
    return Object.values(results);
  };

  closeAndCleanModal = () => {
    this.setState({ error: null });
    this.props.onCloseModal();
  };

  onApply = (keys: string[]) => {
    const { initialSqon, setSqons } = this.props;
    const valuesId = keys.map(this.getKeyFromTreeId);
    setSqons(updateSqons(initialSqon, valuesId));
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
      moveKeys.forEach(mk => {
        const node = this.ontologyStore.getTreeNodeForKey(mk);
        if (node) {
          const childrenKeys = this.ontologyStore.getChildrenKeys(node, true);
          cleanedTargetKeys = nextTargetKeys.filter(k => !childrenKeys.includes(k));
        } else {
          cleanedTargetKeys = nextTargetKeys;
        }
      });
      this.setState({
        targetKeys: cleanedTargetKeys,
      });
    } else if (direction === 'left') {
      this.setState({
        targetKeys: targetKeys.filter(key => moveKeys.indexOf(key) < 0),
      });
    }
  };

  flattenDataSource = (list: TransferItem[] = []) => {
    list.forEach((item: TransferItem) => {
      this.transfertDataSource.push(item);
      this.flattenDataSource(item.children);
    });
  };

  updateData = () => {
    this.setState({ isLoading: true });
    this.ontologyStore
      .fetch(this.props.initialSqon)
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
      .catch(error => this.setState({ isLoading: false, error }));
  };

  shouldComponentUpdate(nextProps: ModalProps, nextState: ModalState) {
    const { isVisible } = this.props;
    if (nextProps.isVisible && !isVisible) {
      // opening the modal again
      this.updateData();
      return false;
    } else if (!nextProps.isVisible && !isVisible) {
      // Closing the modal
      return false;
    }
    return true;
  }

  isLoadingOrEmpty = (): boolean => this.state.isLoading || this.transfertDataSource.length === 0;

  render() {
    const { isVisible } = this.props;
    const { error, targetKeys, isLoading, treeSource } = this.state;
    const dataSource = this.transfertDataSource;
    const hasError = error != null;

    return (
      <Modal
        style={{ height: '80vh' }}
        title="HPO Onthology Browser"
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
            {({ direction, onItemSelect, selectedKeys }) => {
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
                  />
                );
              }
            }}
          </Transfer>
        )}
      </Modal>
    );
  }
}

const mapDispatchToProps = {
  setSqons,
};
export default connect(null, mapDispatchToProps)(OntologyModal);
