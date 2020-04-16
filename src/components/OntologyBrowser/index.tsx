import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, Transfer } from 'antd';
import { RenderResult, TransferItem } from 'antd/lib/transfer';
import findIndex from 'lodash/findIndex';
import { SelectionTree } from './SelectionTree';
import { PhenotypeStore, TreeNode } from './store';
import { setSqons } from '../../store/actionCreators/virtualStudies';

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
  state: ModalState = {
    selectedKeys: [],
    targetKeys: [],
  };
  transfertDataSource: TransferItem[] = [];
  ontologyStore: PhenotypeStore;

  constructor(props: ModalProps) {
    super(props);
    this.ontologyStore = new PhenotypeStore();
    this.updateData();
  }

  getKeyFromTreeId = (treeId: string) => {
    const values = treeId.split('-');
    return values[values.length - 1];
  };

  getKeysFromSqon = (): string[] => {
    const results: any = {};
    const findTreeKey = (treeNode: TreeNode) => {
      this.props.initialSqon.content.forEach(v => {
        if (v.content.value.indexOf(treeNode.title as string) >= 0
          && v.content.field === this.props.selectedField) {
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

  onApply = (keys: string[]) => {
    const { initialSqon, setSqons } = this.props;
    const valuesId = keys.map(this.getKeyFromTreeId);
    setSqons(updateSqons(initialSqon, valuesId));
    this.props.onCloseModal();
  };

  onCancel = (e: React.MouseEvent) => {
    this.props.onCloseModal();
  };

  onChange = (nextTargetKeys: string[], direction: string, moveKeys: string[]) => {
    const { targetKeys } = this.state;
    if (direction === 'right') {
      this.setState({
        targetKeys: [...targetKeys, ...moveKeys],
      });
    } else if (direction === 'left') {
      this.setState({
        targetKeys: targetKeys.filter(key => !moveKeys.indexOf(key)),
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
    this.ontologyStore.fetch(this.props.initialSqon).then(() => {
      this.transfertDataSource = [];
      this.flattenDataSource(this.ontologyStore.tree as TransferItem[]);
      const newTargetKeys = this.getKeysFromSqon();
      this.setState({
        treeSource: this.ontologyStore.tree,
        targetKeys: newTargetKeys,
      });
    });
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

  render() {
    return (
      <Modal
        style={{ height: '80vh' }}
        title="HPO Onthology Browser"
        visible={this.props.isVisible}
        onOk={e => this.onApply(this.state.targetKeys)}
        okText="Apply"
        onCancel={this.onCancel}
        cancelText="Cancel"
        width="90%"
      >
        <Transfer
          dataSource={this.transfertDataSource}
          targetKeys={this.state.targetKeys}
          onChange={this.onChange}
          render={(item: TransferItem): RenderResult => item.title || item.key}
          disabled={false}
          showSelectAll={false}
        >
          {({ direction, onItemSelect, selectedKeys }) => {
            if (direction === 'left') {
              const checkedKeys = [...selectedKeys, ...this.state.targetKeys];
              if (this.state.treeSource) {
                return (
                  <SelectionTree
                    dataSource={this.state.treeSource || []}
                    onItemSelect={onItemSelect}
                    checkedKeys={checkedKeys}
                    targetKeys={this.state.targetKeys}
                  />
                );
              } else {
                return null;
              }
            }
          }}
        </Transfer>
      </Modal>
    );
  }
}

const mapDispatchToProps = {
  setSqons,
};
export default connect(null, mapDispatchToProps)(OntologyModal);
