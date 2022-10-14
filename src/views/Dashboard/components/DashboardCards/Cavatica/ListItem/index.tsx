import cx from 'classnames';
import { List, Space, Typography } from 'antd';
import intl from 'react-intl-universal';
import { TeamOutlined } from '@ant-design/icons';
import EnvironmentVariables from 'helpers/EnvVariables';
import { TCavaticaProjectWithMembers } from 'store/fenceCavatica/types';

import styles from './index.module.scss';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';

interface OwnProps {
  id: any;
  data: TCavaticaProjectWithMembers;
}

const USER_BASE_URL = EnvironmentVariables.configFor('CAVATICA_USER_BASE_URL');
const { Text } = Typography;

const CavaticaListItem = ({ id, data }: OwnProps) => {
  return (
    <List.Item key={id} className={cx('wrapped', styles.CavaticaListItem)}>
      <List.Item.Meta
        title={
          <ExternalLink className={styles.projectLink} href={`${USER_BASE_URL}${data.id}`} hasIcon>
            {data.name}
          </ExternalLink>
        }
        className={styles.itemMeta}
      />
      <Space className={styles.members}>
        <TeamOutlined className={styles.teamIcon} />
        <Text type="secondary">
          {intl.get('screen.dashboard.cards.cavatica.membersCount', {
            count: data.memberCount,
          })}
        </Text>
      </Space>
    </List.Item>
  );
};

export default CavaticaListItem;
