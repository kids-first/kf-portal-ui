import * as React from 'react';
import { Empty, Modal, Result, Transfer } from 'antd';
import { RenderResult, TransferItem } from 'antd/lib/transfer';
import findIndex from 'lodash/findIndex';
import { SelectionTree } from './SelectionTree';
import { PhenotypeStore, removeSameTerms, selectSameTerms } from './store';
import { TreeNode } from './Model';
import { Spinner } from 'uikit/Spinner';
import { isSqonFilter, Sqon, SqonFilters } from 'store/sqon';
import { BranchesOutlined, UserOutlined } from '@ant-design/icons';
import { arrangerProjectId } from 'common/injectGlobals';
import { ARRANGER_API_PARTICIPANT_INDEX_NAME } from 'components/CohortBuilder/common';
import { getFieldDisplayName } from '../../utils';

//@ts-ignore
import ExtendedMappingProvider from '@kfarranger/components/dist/utils/ExtendedMappingProvider';

import './index.css';
import { cloneDeep } from 'lodash';

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

const desactivateAllSameTerms = (allSameTerms: string[], transferItems: TransferItem[]) =>
  transferItems.map((t) => {
    if (allSameTerms.includes(t.key as string)) {
      return Object.assign(t, { disabled: true });
    } else if (t.disabled) {
      return Object.assign(t, { disabled: !t.disabled });
    } else return t;
  });

export const updateSqons = (initialSqon: Sqon, value: string[], selectedField: string): Sqon => {
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
    } else if (value.length > 0) {
      updatedContent.push({
        op: 'in',
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

  render() {
    const { isVisible, title } = this.props;
    const { error, targetKeys, isLoading, treeSource } = this.state;
    const hasError = error != null;

    const allSameTerms = selectSameTerms(targetKeys, treeSource);
    const dataSource = this.transfertDataSource;
    const disabledSameTerms = desactivateAllSameTerms(allSameTerms, dataSource);

    return (
      <ExtendedMappingProvider
        projectId={arrangerProjectId}
        graphqlField={ARRANGER_API_PARTICIPANT_INDEX_NAME}
      >
        {({ extendedMapping = [] }) => (
          <Modal
            className="ontology-modal"
            title={`${getFieldDisplayName(title, extendedMapping)} Browser`}
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
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
