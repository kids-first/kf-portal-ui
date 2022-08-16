import Gravatar from '@ferlab/ui/core/components/Gravatar';
import { Card, Space, Typography } from 'antd';
import { DEFAULT_GRAVATAR_PLACEHOLDER } from 'common/constants';
import Highlighter from 'react-highlight-words';
import { Link } from 'react-router-dom';
import { TUser } from 'services/api/user/models';
import { formatName } from 'views/Community/utils';

import styles from './index.module.scss';

interface OwnProps {
  user: TUser;
  match: string;
}

const MemberCard = ({ user, match }: OwnProps) => {
  return (
    <Link key={user.id} className={styles.memberLink} to={`/member/${user.keycloak_id}`}>
      <Card className={styles.memberCard}>
        <Space direction="vertical" align="center">
          <Gravatar
            className={styles.userGravatar}
            circle
            placeholder={DEFAULT_GRAVATAR_PLACEHOLDER}
            email={user.email || ''}
          />
          <Typography.Title className={styles.memberCardName} level={5}>
            <Highlighter textToHighlight={formatName(user) ?? ''} searchWords={[match]} />
          </Typography.Title>
          {user.affiliation && (
            <Typography.Text type="secondary" className={styles.memberAffiliation}>
              <Highlighter textToHighlight={user.affiliation} searchWords={[match]} />
            </Typography.Text>
          )}
        </Space>
      </Card>
    </Link>
  );
};

export default MemberCard;
