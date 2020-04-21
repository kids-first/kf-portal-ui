import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, Transfer, Spin, Empty, Result } from 'antd';
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

const generateMsgWhenHasDataButNoSelection = (hasData: boolean, isLoading: boolean) => {
  if (isLoading || !hasData) {
    return null;
  }
  return 'Select items from the panel on the left in order to add them to your query';
};

const displaySpinner = () => (
  <div
    style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    }}
  >
    <Spin size={'large'} />
  </div>
);

const displayError = () => (
  <Result status="error" title="An error occurred" subTitle="Please cancel and try again." />
);

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
    const { onCloseModal } = this.props;
    this.setState({ error: null });
    onCloseModal();
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

  updateData = async () => {
    this.setState({ isLoading: true });
    const { initialSqon } = this.props;
    try {
      await this.ontologyStore.fetch(initialSqon);
      this.transfertDataSource = [];
      this.flattenDataSource(this.ontologyStore.tree as TransferItem[]);
      const newTargetKeys = this.getKeysFromSqon();
      this.setState({
        treeSource: this.ontologyStore.tree,
        targetKeys: newTargetKeys,
        isLoading: false,
      });
    } catch (e) {
      this.setState({ error: e, isLoading: false });
    }
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
    const { isVisible } = this.props;
    const { error, targetKeys, isLoading, treeSource } = this.state;
    const dataSource = this.transfertDataSource;
    const hasData = dataSource.length > 0;
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
          displayError()
        ) : (
          <Transfer
            dataSource={dataSource}
            targetKeys={targetKeys}
            onChange={this.onChange}
            render={(item: TransferItem): RenderResult => item.title || item.key}
            disabled={false}
            showSelectAll={false}
            locale={{
              notFoundContent: generateMsgWhenHasDataButNoSelection(hasData, isLoading) || (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ),
            }}
          >
            {({ direction, onItemSelect, selectedKeys }) => {
              if (isLoading) {
                return displaySpinner();
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
