import { InfoCircleOutlined } from '@ant-design/icons';
import { Switch, Tooltip, Typography } from 'antd';
import { useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { usePersona } from 'store/persona';
import { updatePersonaUser } from 'store/persona/thunks';

import styles from './index.module.css';

const ToggleProfileVisibility = () => {
  const dispatch = useDispatch();
  const { personaUserInfo } = usePersona();
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
        defaultChecked={personaUserInfo?.isPublic}
        onChange={(checked) => {
          setIsLoading(true);
          dispatch(
            updatePersonaUser({
              data: {
                ...personaUserInfo,
                isPublic: checked,
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
