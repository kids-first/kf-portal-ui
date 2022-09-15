import { Spin, Row, Col } from 'antd';
import cx from 'classnames';
import MultiLabel, {
  MultiLabelIconPositionEnum,
} from '@ferlab/ui/core/components/labels/MultiLabel';
import { numberFormat } from '@ferlab/ui/core/utils/numberUtils';
import { UserOutlined, ReadOutlined, DatabaseOutlined, FileTextOutlined } from '@ant-design/icons';
import TeamIcon from 'components/Icons/TeamIcon';
import intl from 'react-intl-universal';
import { useGlobals } from 'store/global';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchStats } from 'store/global/thunks';

import styles from 'components/uiKit/DataRelease/index.module.scss';

interface OwnProps {
  className?: string;
}

const formatStorage = (storage: string) => {
  if (!storage) return;
  const parts = storage.split(/\.| /);
  return `${parts[0]}${parts[2]}`;
};

const DataRelease = ({ className = '' }: OwnProps) => {
  const dispatch = useDispatch();
  const { stats } = useGlobals();

  useEffect(() => {
    dispatch(fetchStats());
    // eslint-disable-next-line
  }, []);

  return (
    <Spin spinning={false}>
      <Row className={cx(styles.dataReleaseContainer, className)} justify="space-evenly">
        <Col xs={12} md={4}>
          <MultiLabel
            iconPosition={MultiLabelIconPositionEnum.Top}
            label={numberFormat(stats?.studies!)}
            Icon={<ReadOutlined className={styles.dataReleaseIcon} />}
            className={styles.dataReleaseStatsLabel}
            subLabel={intl.get('components.dataRelease.studies')}
          />
        </Col>
        <Col xs={12} md={4}>
          <MultiLabel
            iconPosition={MultiLabelIconPositionEnum.Top}
            label={numberFormat(stats?.participants!)}
            Icon={<UserOutlined className={styles.dataReleaseIcon} />}
            className={styles.dataReleaseStatsLabel}
            subLabel={intl.get('components.dataRelease.participants')}
          />
        </Col>
        <Col xs={12} md={4}>
          <MultiLabel
            iconPosition={MultiLabelIconPositionEnum.Top}
            label={numberFormat(stats?.families!)}
            Icon={<TeamIcon className={styles.dataReleaseIcon} />}
            className={styles.dataReleaseStatsLabel}
            subLabel={intl.get('components.dataRelease.families')}
          />
        </Col>
        <Col xs={12} md={4}>
          <MultiLabel
            iconPosition={MultiLabelIconPositionEnum.Top}
            label={numberFormat(stats?.samples!)}
            Icon={<FileTextOutlined className={styles.dataReleaseIcon} />}
            className={styles.dataReleaseStatsLabel}
            subLabel={intl.get('components.dataRelease.biospecimens')}
          />
        </Col>
        <Col xs={12} md={4}>
          <MultiLabel
            iconPosition={MultiLabelIconPositionEnum.Top}
            label={numberFormat(stats?.files!)}
            Icon={<FileTextOutlined className={styles.dataReleaseIcon} />}
            className={styles.dataReleaseStatsLabel}
            subLabel={intl.get('components.dataRelease.files')}
          />
        </Col>
        <Col xs={12} md={4}>
          <MultiLabel
            iconPosition={MultiLabelIconPositionEnum.Top}
            label={formatStorage(stats?.fileSize!) || '0TB'}
            Icon={<DatabaseOutlined className={styles.dataReleaseIcon} />}
            className={styles.dataReleaseStatsLabel}
            subLabel={intl.get('components.dataRelease.storage')}
          />
        </Col>
      </Row>
    </Spin>
  );
};

export default DataRelease;
