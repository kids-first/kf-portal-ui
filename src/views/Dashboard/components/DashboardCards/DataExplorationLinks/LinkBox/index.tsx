import { Link } from 'react-router-dom';
import { ArrowRightOutlined } from '@ant-design/icons';
import MultiLabel, {
  MultiLabelIconPositionEnum,
} from '@ferlab/ui/core/components/labels/MultiLabel';
import { Space } from 'antd';
import cx from 'classnames';

import styles from './index.module.scss';

interface OwnProps {
  multiLabelClassName?: string;
  icon: React.ReactNode;
  label: string | number;
  subLabel: string;
  href: string;
  disabled?: boolean;
}

const LinkBox = ({
  multiLabelClassName = '',
  label,
  subLabel,
  icon,
  href,
  disabled = false,
}: OwnProps) =>
  disabled ? (
    <div className={cx(styles.dataExploBox, styles.disabled)}>
      <Space direction="horizontal" size={16} align="start">
        <MultiLabel
          iconPosition={MultiLabelIconPositionEnum.Top}
          label={label}
          Icon={icon}
          className={multiLabelClassName}
          subLabel={subLabel}
        />
        <ArrowRightOutlined className={styles.linkArrow} />
      </Space>
    </div>
  ) : (
    <Link to={href} className={styles.dataExploBox}>
      <Space direction="horizontal" size={16} align="start">
        <MultiLabel
          iconPosition={MultiLabelIconPositionEnum.Top}
          label={label}
          Icon={icon}
          className={multiLabelClassName}
          subLabel={subLabel}
        />
        <ArrowRightOutlined className={styles.linkArrow} />
      </Space>
    </Link>
  );

export default LinkBox;
