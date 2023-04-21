import intl from 'react-intl-universal';
import { IResizableGridLayoutConfig } from '@ferlab/ui/core/layout/ResizableGridLayout';
import cx from 'classnames';

import AgeAtDiagnosisGraphCard from '../AgeAtDiagnosisGraphCard';
import DataCategoryGraphCard from '../DataCategoryGraphCard';
import DataTypeGraphCard from '../DataTypeGraphCard';
import DemographicsGraphCard from '../DemographicGraphCard';
import StudiesGraphCard from '../StudiesGraphCard';
import SunburstGraphCard from '../SunburstGraphCard';

import styles from '../index.module.scss';

export const getDefaultLayouts = (): IResizableGridLayoutConfig[] => [
  {
    title: intl.get('screen.dataExploration.tabs.summary.observed_phenotype.cardTitle'),
    id: 'observed_phenotype',
    component: (
      <SunburstGraphCard
        id="1"
        className={cx(styles.summaryGrapCard, styles.sunburstGraphCard)}
        field="observed_phenotype"
      />
    ),
    base: {
      h: 4,
      w: 8,
      x: 0,
      y: 0,
      minW: 5,
      minH: 4,
    },
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.mondo.cardTitle'),
    id: 'mondo',
    component: (
      <SunburstGraphCard
        id="1"
        className={cx(styles.summaryGrapCard, styles.sunburstGraphCard)}
        field="mondo"
      />
    ),
    base: {
      h: 4,
      w: 8,
      x: 8,
      y: 0,
      minW: 5,
      minH: 4,
    },
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.studies.cardTitle'),
    id: 'studies-graph-card',
    component: <StudiesGraphCard id="6" className={styles.summaryGrapCard} />,
    base: {
      h: 4,
      w: 3,
      x: 0,
      y: 4,
      minW: 3,
      minH: 4,
    },
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.demographic.cardTitle'),
    id: 'demographics-graph-card',
    component: <DemographicsGraphCard id="3" className={styles.summaryGrapCard} />,
    base: {
      h: 4,
      w: 4,
      x: 3,
      y: 4,
      minW: 4,
      minH: 4,
    },
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.ageAtDiagnosis.cardTitle'),
    id: 'age-at-diagnosis-graph-card',
    component: (
      <AgeAtDiagnosisGraphCard
        key="age-at-diagnosis-graph-card"
        id="5"
        className={styles.summaryGrapCard}
      />
    ),
    base: {
      h: 4,
      w: 4,
      x: 7,
      y: 4,
      minW: 4,
      minH: 4,
    },
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.availableData.dataCategoryTitle'),
    id: 'data-category-graph-card',
    component: (
      <DataCategoryGraphCard
        key="data-category-graph-card"
        id="7"
        className={styles.summaryGrapCard}
      />
    ),
    base: {
      h: 4,
      w: 5,
      x: 11,
      y: 4,
      minW: 4,
      minH: 4,
    },
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.availableData.dataTypeTitle'),
    id: 'data-type-graph-card',
    component: <DataTypeGraphCard id="8" className={styles.summaryGrapCard} />,
    base: {
      h: 4,
      w: 12,
      x: 0,
      y: 8,
      minW: 4,
      minH: 4,
    },
  },
];
