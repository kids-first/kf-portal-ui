import Gravatar from '@ferlab/ui/core/components/Gravatar';
import { Skeleton, Space, Typography } from 'antd';
import { IMemberEntity } from 'graphql/members/models';
import { IPersonaUser } from 'services/api/persona/models';
import { formatCountryAndState, formatName } from 'views/Community/utils';

import styles from '../index.module.css';

const { Title, Text } = Typography;

interface OwnProps {
  user?: IPersonaUser | IMemberEntity;
  isLoading?: boolean;
}

const AvatarHeader = ({ user, isLoading = false }: OwnProps) => (
  <Space size={16} direction="vertical" align="center" className={styles.avatarContainer}>
    {isLoading ? (
      <Skeleton.Avatar active size={140} />
    ) : (
      <div className={styles.gravatarWrapper}>
        <Gravatar circle className={styles.gravatar} email={user?.email! || ''} />
      </div>
    )}
    <Space direction="vertical" size={8} align="center">
      {isLoading ? (
        <>
          <Skeleton paragraph={false} loading active className={styles.memberNameSkeleton} />
          <Skeleton paragraph={false} loading active className={styles.memberAssoSkeleton} />
        </>
      ) : (
        <>
          <Title level={3} className={styles.memberName}>
            {formatName(user!)}
          </Title>
          <Text type="secondary">{user?.institution}</Text>

          {(user?.state || user?.country) && (
            <Text type="secondary">{formatCountryAndState(user)}</Text>
          )}
        </>
      )}
    </Space>
  </Space>
);

export default AvatarHeader;
