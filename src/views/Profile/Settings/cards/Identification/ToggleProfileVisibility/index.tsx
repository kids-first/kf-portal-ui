import { useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Switch, Tooltip, Typography } from 'antd';

import { useUser } from 'store/user';
import { updateUser } from 'store/user/thunks';

import styles from './index.module.css';

const ToggleProfileVisibility = () => {
  const dispatch = useDispatch();
  const { userInfo } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className={styles.container}>
      <Typography.Text className={styles.title} strong>
        {intl.get('screen.profileSettings.toggleProfileVisibility.title')}
      </Typography.Text>
      <Tooltip title={intl.get('screen.profileSettings.toggleProfileVisibility.tooltip')}>
        <InfoCircleOutlined className={styles.icon} />
      </Tooltip>
      <Switch
        loading={isLoading}
        defaultChecked={userInfo?.is_public}
        onChange={(checked) => {
          setIsLoading(true);
          dispatch(
            updateUser({
              data: {
                ...userInfo,
                is_public: checked,
              },
              callback: () => {
                setIsLoading(false);
              },
            }),
          );
        }}
      />
    </div>
  );
};

export default ToggleProfileVisibility;
