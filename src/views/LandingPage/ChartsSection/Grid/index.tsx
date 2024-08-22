import { useEffect } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { numberFormat } from '@ferlab/ui/core/utils/numberUtils';

import biosamplesSvg from 'components/assets/kf-portal-icons_biosamples.svg';
import biospecimensSvg from 'components/assets/kf-portal-icons_biospecimens_2.svg';
import cloudSaveSvg from 'components/assets/kf-portal-icons_cloud_files.svg';
import genomesSvg from 'components/assets/kf-portal-icons_genomes.svg';
import participantSvg from 'components/assets/kf-portal-icons_participants_3.svg';
import studiesSvg from 'components/assets/kf-portal-icons_studies_1.svg';
import { useGlobals } from 'store/global';
import { fetchStats } from 'store/global/thunks';

import styles from './index.module.css';

type TGrid = {
  src: string;
  data: number | string;
  description: string;
};

const Stats = ({ src, data, description }: TGrid): JSX.Element => (
  <div className={styles.stats}>
    <img src={src} className={styles.icon} />
    <div className={styles.container}>
      <div className={styles.data}>{data}</div>
      <div className={styles.description}>{description}</div>
    </div>
  </div>
);

const StatsGrid = () => {
  const dispatch = useDispatch();
  const { stats } = useGlobals();

  useEffect(() => {
    dispatch(fetchStats());
    // eslint-disable-next-line
  }, []);
  return (
    <div className={styles.statsGrid}>
      <div className={styles.row}>
        <Stats
          src={studiesSvg}
          data={numberFormat(stats?.studies ?? 0)}
          description={intl.get('screen.loginPage.chartsSection.stats.studies')}
        />

        <Stats
          src={participantSvg}
          data={numberFormat(stats?.participants ?? 0)}
          description={intl.get('screen.loginPage.chartsSection.stats.participants')}
        />

        <Stats
          src={genomesSvg}
          data={`${numberFormat(stats?.variants ?? 0)}+`}
          description={intl.get('screen.loginPage.chartsSection.stats.variants')}
        />
      </div>
      <div className={styles.row}>
        <Stats
          src={biosamplesSvg}
          data={numberFormat(stats?.samples ?? 0)}
          description={intl.get('screen.loginPage.chartsSection.stats.biospecimens')}
        />

        <Stats
          src={cloudSaveSvg}
          data={stats?.fileSize ?? 0}
          description={intl.get('screen.loginPage.chartsSection.stats.files')}
        />

        <Stats
          src={biospecimensSvg}
          data={numberFormat(stats?.genomes ?? 0)}
          description={intl.get('screen.loginPage.chartsSection.stats.genomes')}
        />
      </div>
    </div>
  );
};

export default StatsGrid;
