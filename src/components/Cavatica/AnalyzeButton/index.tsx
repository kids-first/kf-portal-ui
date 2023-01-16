import { useCallback, useEffect } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { CloudUploadOutlined } from '@ant-design/icons';
import { BooleanOperators } from '@ferlab/ui/core/data/sqon/operators';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';
import { Button, Modal } from 'antd';
import { CAVATICA_FILE_BATCH_SIZE } from 'views/Studies/utils/constant';

import { FENCE_NAMES } from 'common/fenceTypes';
import AnalyzeModal from 'components/Cavatica/AnalyzeModal';
import CreateProjectModal from 'components/Cavatica/CreateProjectModal';
import { useFenceCavatica } from 'store/fenceCavatica';
import { fenceCavaticaActions } from 'store/fenceCavatica/slice';
import { beginAnalyse } from 'store/fenceCavatica/thunks';
import { connectToFence } from 'store/fenceConnection/thunks';

interface OwnProps {
  fileIds: string[];
  sqon?: ISqonGroupFilter;
  type?: 'default' | 'primary';
  disabled?: boolean;
}

const CavaticaAnalyzeButton: React.FC<OwnProps> = ({
  fileIds,
  sqon,
  type = 'default',
  disabled = false,
}) => {
  const { isConnected, isInitializingAnalyse, beginAnalyseAfterConnection } = useFenceCavatica();

  const dispatch = useDispatch();

  const onBeginAnalyse = useCallback(
    () =>
      dispatch(
        beginAnalyse({
          sqon: sqon || {
            op: BooleanOperators.and,
            content: [],
          },
          fileIds,
        }),
      ),
    [dispatch, fileIds, sqon],
  );

  useEffect(() => {
    if (isConnected && beginAnalyseAfterConnection) {
      onBeginAnalyse();
    }
  }, [isConnected, beginAnalyseAfterConnection, onBeginAnalyse]);

  const onCavaticaUploadLimitReached = () =>
    Modal.error({
      title: intl.get('screen.dataExploration.tabs.datafiles.cavatica.bulkImportLimit.title'),
      content: intl.getHTML(
        'screen.dataExploration.tabs.datafiles.cavatica.bulkImportLimit.description',
        {
          limit: CAVATICA_FILE_BATCH_SIZE,
        },
      ),
      okText: 'Ok',
      cancelText: undefined,
    });

  const onCavaticaConnectionRequired = () =>
    Modal.confirm({
      type: 'warn',
      title: intl.get('screen.dataExploration.tabs.datafiles.cavatica.authWarning.title'),
      content: intl.get('screen.dataExploration.tabs.datafiles.cavatica.authWarning.description'),
      okText: intl.get('screen.dataExploration.tabs.datafiles.cavatica.authWarning.connect'),
      onOk: () => {
        dispatch(fenceCavaticaActions.setBeginAnalyseConnectionFlag());
        dispatch(connectToFence(FENCE_NAMES.cavatica));
      },
    });

  return (
    <>
      <Button
        type={type}
        icon={<CloudUploadOutlined />}
        loading={isInitializingAnalyse}
        disabled={disabled}
        onClick={() => {
          if (isConnected) {
            if (fileIds.length > CAVATICA_FILE_BATCH_SIZE) {
              onCavaticaUploadLimitReached();
            } else {
              dispatch(
                beginAnalyse({
                  sqon: sqon || {
                    op: BooleanOperators.and,
                    content: [],
                  },
                  fileIds: fileIds,
                }),
              );
            }
          } else {
            onCavaticaConnectionRequired();
          }
        }}
      >
        {intl.get('screen.dataExploration.tabs.datafiles.cavatica.analyseInCavatica')}
      </Button>
      {isConnected && (
        <>
          <AnalyzeModal />
          <CreateProjectModal />
        </>
      )}
    </>
  );
};

export default CavaticaAnalyzeButton;
