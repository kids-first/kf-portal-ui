import { Modal, Transfer } from 'antd';
import { RenderResult, TransferItem } from 'antd/lib/transfer';
import * as React from 'react';
import { SelectionTree } from './SelectionTree';
import { PhenotypeStore, TreeNode } from './store';

import './index.css';

type ModalProps = {
  isVisible: boolean;
  onCloseModal: Function;
  initialSqon: object;
  onSqonUpdate: Function;
  title: string;
};

class OntologyModal extends React.Component<ModalProps, {}> {
  state: { selectedKeys: string[]; treeSource?: TreeNode[]; targetKeys: string[] } = {
    selectedKeys: [],
    targetKeys: [],
  };
  transfertDataSource: TransferItem[] = [];
  ontologyStore: PhenotypeStore;

  constructor(props: ModalProps) {
    super(props);
    this.ontologyStore = new PhenotypeStore();
    this.ontologyStore.fetch().then(this.updatePhenotypes);
  }

  onApply = (e: React.MouseEvent) => {
    const { onSqonUpdate, title, initialSqon } = this.props;
    console.log('onsubmit : ', initialSqon, ' title ', title);
    onSqonUpdate(title, initialSqon);
    // this.handleCloseFilter(false);
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
        targetKeys: targetKeys.filter(key => !!moveKeys.indexOf(key)),
      });
    }
  };

  flattenDataSource = (list: TransferItem[] = []) => {
    list.forEach((item: TransferItem) => {
      this.transfertDataSource.push(item);
      this.flattenDataSource(item.children);
    });
  };

  updatePhenotypes = () => {
    this.flattenDataSource(this.ontologyStore.tree as TransferItem[]);
    this.setState({
      transfertSource: this.ontologyStore.phenotypes,
      treeSource: this.ontologyStore.tree,
    });
  };

  render() {
    return (
      <Modal
        style={{ height: '80vh' }}
        title="HPO Onthology Browser"
        visible={this.props.isVisible}
        onOk={this.onApply}
        okText="Add"
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
              return (
                <SelectionTree
                  dataSource={this.state.treeSource || []}
                  onItemSelect={onItemSelect}
                  checkedKeys={checkedKeys}
                  targetKeys={this.state.targetKeys}
                />
              );
            }
          }}
        </Transfer>
      </Modal>
    );
  }
}

export default OntologyModal;
