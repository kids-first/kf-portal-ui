import { InfoCircleOutlined } from '@ant-design/icons';
import { Space, Switch, Tooltip, Typography } from 'antd';
import { useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { usePersona } from 'store/persona';
import { updatePersonaUser } from 'store/persona/thunks';

const ToggleProfileVisibility = () => {
  const dispatch = useDispatch();
  const { personaUserInfo } = usePersona();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Space align="baseline">
      <Typography.Title level={5}>
        {intl.get('screen.profileSettings.toggleProfileVisibility.title')}
      </Typography.Title>
      <Tooltip title={intl.get('screen.profileSettings.toggleProfileVisibility.tooltip')}>
        <InfoCircleOutlined />
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
    </Space>
  );
};

export default ToggleProfileVisibility;
