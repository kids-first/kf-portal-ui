import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip, Typography } from 'antd';
import cx from 'classnames';

import styles from './index.module.scss';

interface OwnProps {
  title: string;
  className?: string;
  tooltipText?: string;
}

const SearchLabel = ({ title, tooltipText, className = '' }: OwnProps) => (
  <span className={cx(styles.searchLabel, styles.titleWrapper, className)}>
    <Typography.Text strong className={styles.title}>
      {title}
    </Typography.Text>
    {tooltipText && (
      <Tooltip arrowPointAtCenter placement="topLeft" title={tooltipText}>
        <InfoCircleOutlined className={styles.tooltipIcon} />
      </Tooltip>
    )}
  </span>
);

export default SearchLabel;
