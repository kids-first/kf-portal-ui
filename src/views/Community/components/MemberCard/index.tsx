import Gravatar from '@ferlab/ui/core/components/Gravatar';
import { Card, Space, Typography } from 'antd';
import Highlighter from 'react-highlight-words';
import { Link } from 'react-router-dom';
import { TPersonaUser } from 'services/api/persona/models';
import { formatName } from 'views/Community/utils';

import styles from './index.module.scss';

interface OwnProps {
  user: TPersonaUser;
  match: string;
}

const MemberCard = ({ user, match }: OwnProps) => {
  return (
    <Link key={user._id} className={styles.memberLink} to={`/member/${user._id}`}>
      <Card className={styles.memberCard}>
        <Space direction="vertical" align="center">
          <Gravatar className={styles.userGravatar} circle email={user.email || ''} />
          <Typography.Title className={styles.memberCardName} level={5}>
            <Highlighter textToHighlight={formatName(user) ?? ''} searchWords={[match]} />
          </Typography.Title>
          {user.institution && (
            <Typography.Text type="secondary" className={styles.memberAffiliation}>
              <Highlighter textToHighlight={user.institution} searchWords={[match]} />
            </Typography.Text>
          )}
        </Space>
      </Card>
    </Link>
  );
};

export default MemberCard;
