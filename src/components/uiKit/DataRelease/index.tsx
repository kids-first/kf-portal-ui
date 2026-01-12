import { useEffect } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { FileTextOutlined, ReadOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import MultiLabel, {
  MultiLabelIconPositionEnum,
} from '@ferlab/ui/core/components/labels/MultiLabel';
import { numberFormat } from '@ferlab/ui/core/utils/numberUtils';
import { Col, Row, Spin } from 'antd';
import cx from 'classnames';

import BiospecimenIcon from 'components/Icons/BiospecimenIcon';
import styles from 'components/uiKit/DataRelease/index.module.css';
import { useGlobals } from 'store/global';
import { fetchStats } from 'store/global/thunks';

interface OwnProps {
  className?: string;
}

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
            Icon={<TeamOutlined className={styles.dataReleaseIcon} />}
            className={styles.dataReleaseStatsLabel}
            subLabel={intl.get('components.dataRelease.families')}
          />
        </Col>
        <Col xs={12} md={4}>
          <MultiLabel
            iconPosition={MultiLabelIconPositionEnum.Top}
            label={numberFormat(stats?.samples!)}
            Icon={<BiospecimenIcon className={styles.dataReleaseIcon} />}
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
      </Row>
    </Spin>
  );
};

export default DataRelease;
