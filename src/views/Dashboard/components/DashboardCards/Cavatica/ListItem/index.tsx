import cx from 'classnames';
import { List, Space, Typography } from 'antd';
import intl from 'react-intl-universal';
import { TeamOutlined } from '@ant-design/icons';
import ExternalLinkIcon from 'components/Icons/ExternalLinkIcon';
import EnvironmentVariables from 'helpers/EnvVariables';
import { TCavaticaProjectWithMembers } from 'store/fenceCavatica/types';

import styles from './index.module.scss';

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
          <a
            href={`${USER_BASE_URL}${data.id}`}
            target="_blank"
            rel="noreferrer"
            className={styles.projectLink}
          >
            {data.name}
            <ExternalLinkIcon className={styles.externalIcon} height={14} width={14} />
          </a>
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
