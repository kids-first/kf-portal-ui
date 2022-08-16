import { FileTextOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, List, Modal, Space, Tag, TreeSelect, Typography } from 'antd';
import { IFileEntity } from 'graphql/files/models';
import { groupBy } from 'lodash';
import { LegacyDataNode } from 'rc-tree-select/lib/TreeSelect';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CavaticaApi } from 'services/api/cavatica';
import { CAVATICA_TYPE } from 'services/api/cavatica/models';
import { useFenceCavatica } from 'store/fenceCavatica';
import { fenceCavaticaActions } from 'store/fenceCavatica/slice';
import { fetchAllProjects, startBulkImportJob } from 'store/fenceCavatica/thunks';
import { ICavaticaTreeNode } from 'store/fenceCavatica/types';
import intl from 'react-intl-universal';

import styles from './index.module.scss';

const { Text } = Typography;

const AnalyseModal = () => {
  const {
    isAnalyseModalOpen,
    projectsTree,
    isLoading,
    bulkImportData,
    newlyCreatedProject,
    isBulkImportLoading,
  } = useFenceCavatica();
  const dispatch = useDispatch();
  const [selectedTreeNode, setSelectedTreeNode] = useState<ICavaticaTreeNode | undefined>();
  const [localProjectTree, setLocalProjectTree] = useState<ICavaticaTreeNode[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleOnCancel = () => {
    setLocalProjectTree(projectsTree);
    setSelectedTreeNode(undefined);
    dispatch(fenceCavaticaActions.cancelAnalyse());
  };

  const handleOnOk = () => dispatch(startBulkImportJob(selectedTreeNode!));

  const handleOnClear = () => setSelectedTreeNode(undefined);

  const resetTreeAndSelection = () => {
    setSelectedTreeNode(undefined);
    setLocalProjectTree(projectsTree);
  };

  const handleCreateProject = () => {
    setDropdownOpen(false);
    // Need a timeout else the dropdown stay visible
    // when the create project modal open
    setTimeout(() => {
      dispatch(fenceCavaticaActions.beginCreateProject());
    }, 100);
  };

  const NewProjectButton = () => (
    <Button size="small" icon={<PlusOutlined />} onClick={handleCreateProject}>
      {intl.get('screen.dataExploration.tabs.datafiles.cavatica.analyseModal.newProject')}
    </Button>
  );

  useEffect(() => {
    if (isAnalyseModalOpen) {
      resetTreeAndSelection();
      dispatch(fetchAllProjects());
    }
    // eslint-disable-next-line
  }, [isAnalyseModalOpen]);

  useEffect(() => {
    setLocalProjectTree(projectsTree);
  }, [projectsTree]);

  useEffect(() => {
    if (newlyCreatedProject) {
      setSelectedTreeNode(newlyCreatedProject);
    }
  }, [newlyCreatedProject]);

  const onLoadData = async (node: LegacyDataNode) => {
    const { data } = await CavaticaApi.listFilesAndFolders(
      node.id,
      node.type === CAVATICA_TYPE.PROJECT,
    );

    const childs =
      data?.items
        .filter(({ type }) => type !== CAVATICA_TYPE.FILE)
        .map((child) => {
          let enrichedChild: any = {
            ...child,
            value: child.id,
            title: child.name,
            pId: node.id,
          };

          return enrichedChild;
        }) || [];

    setLocalProjectTree([...localProjectTree, ...childs]);
  };

  return (
    <Modal
      title={intl.get('screen.dataExploration.tabs.datafiles.cavatica.analyseInCavatica')}
      visible={isAnalyseModalOpen}
      okText={intl.get('screen.dataExploration.tabs.datafiles.cavatica.analyseModal.copyFiles')}
      okButtonProps={{
        disabled: !selectedTreeNode?.id,
        loading: isBulkImportLoading,
      }}
      onOk={handleOnOk}
      onCancel={handleOnCancel}
      className={styles.cavaticaAnalyseModal}
      wrapClassName={styles.cavaticaModalWrapper}
      destroyOnClose
    >
      <Space direction="vertical" size={24}>
        <Space direction="vertical" size={5} className={styles.treeSelectorWrapper}>
          <Text strong>
            {intl.get('screen.dataExploration.tabs.datafiles.cavatica.analyseModal.copyFilesTo')}
          </Text>
          <TreeSelect
            treeDataSimpleMode
            open={dropdownOpen}
            showAction={['focus']}
            className={styles.treeSelector}
            loading={isLoading}
            notFoundContent={
              <Space
                direction="vertical"
                className={styles.treeSelectEmpty}
                align="center"
                size={16}
              >
                <Text type="secondary">
                  {intl.get(
                    'screen.dataExploration.tabs.datafiles.cavatica.analyseModal.createProjectToPushFileTo',
                  )}
                </Text>
                <NewProjectButton />
              </Space>
            }
            onDropdownVisibleChange={setDropdownOpen}
            showSearch
            value={selectedTreeNode?.value}
            dropdownClassName={styles.cavaticaTreeDropdown}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Select a project"
            allowClear
            onClear={handleOnClear}
            onSelect={(_: any, node: any /* ICavaticaTreeNode */) => {
              setSelectedTreeNode(node);
            }}
            loadData={onLoadData}
            treeData={localProjectTree}
            dropdownRender={(menu) => (
              <>
                <div className={styles.cavaticaTreeDropdownMenu}>{menu}</div>
                {localProjectTree.length > 0 && (
                  <>
                    <Divider className={styles.cavaticaTreeDropdownDivider} />
                    <div className={styles.cavaticaTreeDropdownFooter}>
                      <NewProjectButton />
                    </div>
                  </>
                )}
              </>
            )}
          />
        </Space>
        <Text>
          <Text>
            {intl.get(
              'screen.dataExploration.tabs.datafiles.cavatica.analyseModal.youAreAuthorizedToCopy',
            )}
          </Text>{' '}
          <Tag className={styles.authorizedFilesTag} icon={<FileTextOutlined />}>
            {bulkImportData.authorizedFiles.length} files
          </Tag>{' '}
          <Text>(out of {bulkImportData.files.length} selected) to your Cavatica workspace.</Text>
        </Text>
        <List
          size="small"
          className={styles.studiesList}
          dataSource={aggregateFilesToStudy(bulkImportData.files)}
          renderItem={(item) => {
            return (
              <List.Item>
                <List.Item.Meta description={<Text ellipsis>{item.title}</Text>} />
                <Text type="secondary">
                  {item.nbFiles} <FileTextOutlined />
                </Text>
              </List.Item>
            );
          }}
        />
      </Space>
    </Modal>
  );
};

const aggregateFilesToStudy = (filesToCopy: IFileEntity[]) =>
  Object.entries(groupBy(filesToCopy, 'study.study_id')).map((study) => ({
    title: study[1][0].study.study_name,
    nbFiles: study[1].length,
  }));

export default AnalyseModal;
