import { useEffect } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { FileTextOutlined, ReadOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { numberFormat } from '@ferlab/ui/core/utils/numberUtils';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Col, Row } from 'antd';
import CardHeader from 'views/Dashboard/components/CardHeader';

import BiospecimenIcon from 'components/Icons/BiospecimenIcon';
import { useGlobals } from 'store/global';
import { fetchStats } from 'store/global/thunks';
import { STATIC_ROUTES } from 'utils/routes';

import LinkBox from './LinkBox';

import styles from './index.module.scss';

const DataExplorationLinks = () => {
  const dispatch = useDispatch();
  const { stats } = useGlobals();

  useEffect(() => {
    dispatch(fetchStats());
    // eslint-disable-next-line
  }, []);

  return (
    <GridCard
      wrapperClassName={styles.dataExplorationLinksWrapper}
      title={<CardHeader id="data-exploration" title="Data Exploration" />}
      className={styles.dataExplorationLinksCard}
      content={
        <Row gutter={[16, 16]}>
          <Col flex="auto" className={styles.customCol}>
            <LinkBox
              href={STATIC_ROUTES.STUDIES}
              multiLabelClassName={styles.dataReleaseStatsLabel}
              label={numberFormat(stats?.studies!)}
              subLabel={intl.get('components.dataRelease.studies')}
              icon={<ReadOutlined className={styles.dataReleaseIcon} />}
            />
          </Col>
          <Col flex="auto" className={styles.customCol}>
            <LinkBox
              href={STATIC_ROUTES.DATA_EXPLORATION_PARTICIPANTS}
              multiLabelClassName={styles.dataReleaseStatsLabel}
              label={numberFormat(stats?.participants!)}
              subLabel={intl.get('components.dataRelease.participants')}
              icon={<UserOutlined className={styles.dataReleaseIcon} />}
            />
          </Col>
          <Col flex="auto" className={styles.customCol}>
            <LinkBox
              disabled
              href=""
              multiLabelClassName={styles.dataReleaseStatsLabel}
              label={numberFormat(stats?.families!)}
              subLabel={intl.get('components.dataRelease.families')}
              icon={<TeamOutlined className={styles.dataReleaseIcon} />}
            />
          </Col>
          <Col flex="auto" className={styles.customCol}>
            <LinkBox
              href={STATIC_ROUTES.DATA_EXPLORATION_BIOSPECIMENS}
              multiLabelClassName={styles.dataReleaseStatsLabel}
              label={numberFormat(stats?.samples!)}
              subLabel={intl.get('components.dataRelease.biospecimens')}
              icon={<BiospecimenIcon className={styles.dataReleaseIcon} />}
            />
          </Col>

          <Col flex="auto" className={styles.customCol}>
            <LinkBox
              href={STATIC_ROUTES.DATA_EXPLORATION_DATAFILES}
              multiLabelClassName={styles.dataReleaseStatsLabel}
              label={numberFormat(stats?.files!)}
              subLabel={intl.get('components.dataRelease.files')}
              icon={<FileTextOutlined className={styles.dataReleaseIcon} />}
            />
          </Col>
        </Row>
      }
    />
  );
};

export default DataExplorationLinks;
