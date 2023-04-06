import intl from 'react-intl-universal';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Alert } from 'antd';

import styles from './DownloadRequestAccessModal/index.module.scss';

const TooMuchFilesAlert = () => (
  <Alert
    type="error"
    showIcon
    icon={<CloseCircleOutlined className={styles.tooMuchFilesIcon} />}
    className={styles.tooMuchFiles}
    message={intl.get('api.report.error.tooMuchFilesTitle')}
    description={intl.get('api.report.error.tooMuchFiles')}
  />
);

export default TooMuchFilesAlert;
