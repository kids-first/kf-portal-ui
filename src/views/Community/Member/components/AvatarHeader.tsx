import Gravatar from '@ferlab/ui/core/components/Gravatar';
import { Skeleton, Space, Typography } from 'antd';
import { DEFAULT_GRAVATAR_PLACEHOLDER } from 'common/constants';
import { TPersonaUser } from 'services/api/persona/models';
import { formatName } from '../../utils';

import styles from '../index.module.scss';

interface OwnProps {
  user?: TPersonaUser;
  isLoading?: boolean;
}

const AvatarHeader = ({ user, isLoading = false }: OwnProps) => (
  <Space size={16} direction="vertical" align="center" className={styles.avatarContainer}>
    {isLoading ? (
      <Skeleton.Avatar active size={140} />
    ) : (
      <div className={styles.gravatarWrapper}>
        <Gravatar
          circle
          className={styles.gravatar}
          placeholder={DEFAULT_GRAVATAR_PLACEHOLDER}
          email={user?.email! || ''}
        />
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
          <Typography.Title level={3} className={styles.memberName}>
            {formatName(user!)}
          </Typography.Title>
          {/* {user?.affiliation && (
            <Typography.Text type="secondary">{user?.affiliation}</Typography.Text>
          )} */}
        </>
      )}
    </Space>
  </Space>
);

export default AvatarHeader;
