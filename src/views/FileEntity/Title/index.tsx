import intl from 'react-intl-universal';
import { FileTextOutlined, LockOutlined, UnlockFilled } from '@ant-design/icons';
import { EntityTitle } from '@ferlab/ui/core/pages/EntityPage';
import { Button, Popover, Space, Tooltip } from 'antd';
import { IFileEntity } from 'graphql/files/models';

import { FENCE_CONNECTION_STATUSES } from 'common/fenceTypes';
import CavaticaAnalyzeButton from 'components/Cavatica/AnalyzeButton';
import { useFenceConnection } from 'store/fenceConnection';
import { userHasAccessToFile } from 'utils/dataFiles';

import styles from './index.module.scss';
import PopoverContentLink from 'components/uiKit/PopoverContentLink';

interface OwnProps {
  file?: IFileEntity;
  loading?: boolean;
}

const FileEntityTitle: React.FC<OwnProps> = ({ file, loading }) => {
  const { fencesAllAcls, connectionStatus } = useFenceConnection();

  const hasAccess = file
    ? userHasAccessToFile(
      file,
      fencesAllAcls,
      connectionStatus.cavatica === FENCE_CONNECTION_STATUSES.connected,
      connectionStatus.gen3 === FENCE_CONNECTION_STATUSES.connected,
    )
    : false;

  const title = {
    text: file?.file_id,
    icon: <FileTextOutlined />,
    tag: hasAccess ? (
      <Popover
        placement='bottom'
        overlayClassName={styles.popOverContent}
        title={intl.get('entities.file.fileAuthorization')}
        content={intl.get('entities.file.unlocked')}>
        <UnlockFilled className={styles.unlocked} />
      </Popover>
    ) : (
      <Popover
        overlayClassName={styles.popOverContent}
        title={intl.get('entities.file.fileAuthorization')}
        content={
          <span>
            {intl.get('entities.file.locked')}
            <PopoverContentLink className={styles.contentLink} externalHref="https://d3b.notion.site/Applying-for-Access-ffed3a85b29741388b30a1ad0687003f" title={intl.get('entities.file.fileReadMore')} />
          </span>
        }>
        <LockOutlined className={styles.locked} />
      </Popover>
    ),
    extra: (
      <Space>
        <Button type="primary">{intl.get('entities.file.manifest')}</Button>
        {file && <CavaticaAnalyzeButton fileIds={[file.file_id]} />}
      </Space>
    ),
  };

  return <EntityTitle {...title} loading={loading} />;
};

export default FileEntityTitle;
