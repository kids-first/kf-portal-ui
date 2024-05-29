import intl from 'react-intl-universal';
import { IResizableGridLayoutConfig } from '@ferlab/ui/core/layout/ResizableGridLayout';
import {
  ageAtDiagnosisDefaultGridConfig,
  dataCategoryDefaultGridConfig,
  dataTypeDefaultGridConfig,
  demographicsDefaultGridConfig,
  mondoDefaultGridConfig,
  observedPhenotypeDefaultGridConfig,
  studiesDefaultGridConfig,
} from '@ferlab/ui/core/layout/ResizableGridLayout/utils';

import AgeAtDiagnosisGraphCard from '../AgeAtDiagnosisGraphCard';
import DataCategoryGraphCard from '../DataCategoryGraphCard';
import DataTypeGraphCard from '../DataTypeGraphCard';
import DemographicsGraphCard from '../DemographicGraphCard';
import MostFrequentDiagnosisGraphCard from '../MostFrequentDiagnosisGraphCard';
import MostFrequentPhenotypesGraphCard from '../MostFrequentPhenotypesGraphCard';
import StudiesGraphCard from '../StudiesGraphCard';
import SunburstGraphCard from '../SunburstGraphCard';

export const UID = 'summary';
export const OBSERVED_PHENOTYPE_ID = 'observed_phenotype';
export const MONDO_ID = 'mondo';
export const MOST_FREQUENT_DIAGNOSES_ID = 'most_frequent_disagnoses';
export const MOST_FREQUENT_PHENOTYPES_ID = 'most_frequent_phenotypes';
export const DEMOGRAPHICS_GRAPH_CARD_ID = 'demographics-graph-card';
export const AGE_AT_DIAGNOSIS_GRAPH_CARD_ID = 'age-at-diagnosis-graph-card';
export const DATA_CATEGORY_GRAPH_CARD_ID = 'data-category-graph-card';
export const STUDIES_GRAPH_CARD_ID = 'studies-graph-card';
export const DATA_TYPE_GRAPH_CARD_ID = 'data-type-graph-card';

export const getDefaultLayouts = (): IResizableGridLayoutConfig[] => [
  {
    title: intl.get('screen.dataExploration.tabs.summary.observed_phenotype.cardTitle'),
    id: OBSERVED_PHENOTYPE_ID,
    component: <SunburstGraphCard id={OBSERVED_PHENOTYPE_ID} field="observed_phenotype" />,
    hidden: true,
    ...observedPhenotypeDefaultGridConfig,
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.mondo.cardTitle'),
    id: MONDO_ID,
    component: <SunburstGraphCard id={MONDO_ID} field="mondo" />,
    hidden: true,
    ...mondoDefaultGridConfig,
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.mostFrequentPhenotypes.cardTitle'),
    id: MOST_FREQUENT_PHENOTYPES_ID,
    component: <MostFrequentPhenotypesGraphCard />,
    base: {
      h: 4,
      minH: 3,
      minW: 4,
      w: 8,
      x: 0,
      y: 4,
    },
    lg: {
      h: 4,
      w: 8,
      x: 0,
      y: 4,
    },
    md: {
      h: 4,
      w: 6,
      x: 0,
      y: 4,
    },
    sm: {
      h: 4,
      w: 5,
      x: 0,
      y: 4,
    },
    xs: {
      h: 6,
      w: 6,
      x: 0,
      y: 12,
    },
    xxs: {
      h: 6,
      w: 4,
      x: 0,
      y: 12,
    },
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.mostFrequentDiagnoses.cardTitle'),
    id: MOST_FREQUENT_DIAGNOSES_ID,
    component: <MostFrequentDiagnosisGraphCard />,
    base: {
      h: 4,
      minH: 3,
      minW: 4,
      w: 8,
      x: 8,
      y: 4,
    },
    lg: {
      h: 4,
      w: 8,
      x: 8,
      y: 4,
    },
    md: {
      h: 4,
      w: 6,
      x: 6,
      y: 4,
    },
    sm: {
      h: 4,
      w: 5,
      x: 5,
      y: 4,
    },
    xs: {
      h: 6,
      w: 6,
      x: 0,
      y: 12,
    },
    xxs: {
      h: 6,
      w: 4,
      x: 0,
      y: 12,
    },
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.demographic.cardTitle'),
    id: DEMOGRAPHICS_GRAPH_CARD_ID,
    component: <DemographicsGraphCard />,
    ...demographicsDefaultGridConfig,
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.ageAtDiagnosis.cardTitle'),
    id: AGE_AT_DIAGNOSIS_GRAPH_CARD_ID,
    component: <AgeAtDiagnosisGraphCard />,
    ...ageAtDiagnosisDefaultGridConfig,
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.availableData.dataCategoryTitle'),
    id: DATA_CATEGORY_GRAPH_CARD_ID,
    component: <DataCategoryGraphCard />,
    ...dataCategoryDefaultGridConfig,
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.studies.cardTitle'),
    id: STUDIES_GRAPH_CARD_ID,
    component: <StudiesGraphCard />,
    ...studiesDefaultGridConfig,
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.availableData.dataTypeTitle'),
    id: DATA_TYPE_GRAPH_CARD_ID,
    component: <DataTypeGraphCard />,
    ...dataTypeDefaultGridConfig,
  },
];
