import { useDispatch } from 'react-redux';
import ResizableGridLayout, {
  TSerializedResizableGridLayoutConfig,
} from '@ferlab/ui/core/layout/ResizableGridLayout';
import { Space } from 'antd';

import { useUser } from 'store/user';
import { updateUserConfig } from 'store/user/thunks';

import { getDefaultLayouts, UID } from './utils/grid';

import styles from './index.module.css';

const SummaryTab = () => {
  const dispatch = useDispatch();
  const { userInfo } = useUser();
  const defaultLayouts = getDefaultLayouts();

  return (
    <Space className={styles.wrapper} direction="vertical">
      <ResizableGridLayout
        uid={UID}
        defaultLayouts={defaultLayouts}
        layouts={userInfo?.config.data_exploration?.summary?.layouts}
        onReset={(layouts: TSerializedResizableGridLayoutConfig[]) => {
          dispatch(
            updateUserConfig({
              data_exploration: {
                summary: {
                  layouts,
                },
              },
            }),
          );
        }}
        onConfigUpdate={(layouts: TSerializedResizableGridLayoutConfig[]) => {
          dispatch(
            updateUserConfig({
              data_exploration: {
                summary: {
                  layouts,
                },
              },
            }),
          );
        }}
      />
    </Space>
  );
};

export default SummaryTab;
