import intl from 'react-intl-universal';
import { IResizableGridLayoutConfig } from '@ferlab/ui/core/layout/ResizableGridLayout';
import {
  ageAtDiagnosisDefaultGridConfig,
  dataCategoryDefaultGridConfig,
  demographicsDefaultGridConfig,
  studiesDefaultGridConfig,
} from '@ferlab/ui/core/layout/ResizableGridLayout/utils';
import SampleTypeGraphCard from 'views/DataExploration/components/PageContent/tabs/Summary/SampleType';

import AgeAtDiagnosisGraphCard from '../AgeAtDiagnosisGraphCard';
import DataCategoryGraphCard from '../DataCategoryGraphCard';
import DataTypeGraphCard from '../DataTypeGraphCard';
import DemographicsGraphCard from '../DemographicGraphCard';
import MostFrequentDiagnosisGraphCard from '../MostFrequentDiagnosisGraphCard';
import MostFrequentPhenotypesGraphCard from '../MostFrequentPhenotypesGraphCard';
import StudiesGraphCard from '../StudiesGraphCard';

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
    title: intl.get('screen.dataExploration.tabs.summary.mostFrequentPhenotypes.cardTitle'),
    id: MOST_FREQUENT_PHENOTYPES_ID,
    component: <MostFrequentPhenotypesGraphCard />,
    base: {
      h: 4,
      w: 8,
      x: 0,
      y: 0,
      minH: 3,
      minW: 4,
    },
    lg: {
      h: 4,
      w: 8,
      x: 0,
      y: 0,
    },
    md: {
      h: 4,
      w: 6,
      x: 0,
      y: 0,
    },
    sm: {
      h: 4,
      w: 5,
      x: 0,
      y: 0,
    },
    xs: {
      h: 6,
      w: 6,
      x: 0,
      y: 0,
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
      y: 0,
    },
    lg: {
      h: 4,
      w: 8,
      x: 8,
      y: 0,
    },
    md: {
      h: 4,
      w: 6,
      x: 6,
      y: 0,
    },
    sm: {
      h: 4,
      w: 5,
      x: 5,
      y: 0,
    },
    xs: {
      h: 6,
      w: 6,
      x: 0,
      y: 6,
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
    base: {
      h: 3,
      w: 6,
      x: 0,
      y: 4,
      minH: 2,
      minW: 4,
    },
    lg: {
      h: 3,
      w: 6,
      x: 0,
      y: 4,
    },
    md: {
      h: 3,
      w: 6,
      x: 0,
      y: 4,
    },
    sm: {
      h: 2,
      w: 7,
      x: 0,
      y: 4,
    },
    xs: {
      h: 2,
      w: 6,
      x: 0,
      y: 12,
    },
    xxs: {
      h: 2,
      w: 4,
      x: 0,
      y: 24,
    },
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.ageAtDiagnosis.cardTitle'),
    id: AGE_AT_DIAGNOSIS_GRAPH_CARD_ID,
    component: <AgeAtDiagnosisGraphCard />,
    base: {
      h: 3,
      w: 8,
      x: 0,
      y: 7,
      minH: 2,
      minW: 3,
    },
    lg: {
      h: 3,
      w: 8,
      x: 0,
      y: 7,
    },
    md: {
      h: 3,
      w: 4,
      x: 8,
      y: 4,
    },
    sm: {
      h: 3,
      w: 5,
      x: 0,
      y: 6,
    },
    xs: {
      h: 3,
      w: 6,
      x: 0,
      y: 17,
    },
    xxs: {
      h: 2,
      w: 4,
      x: 0,
      y: 26,
    },
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.availableData.dataCategoryTitle'),
    id: DATA_CATEGORY_GRAPH_CARD_ID,
    component: <DataCategoryGraphCard />,
    base: {
      h: 3,
      w: 8,
      x: 8,
      y: 4,
      minH: 2,
      minW: 3,
    },
    lg: {
      h: 3,
      w: 8,
      x: 8,
      y: 4,
    },
    md: {
      h: 3,
      w: 6,
      x: 6,
      y: 7,
    },
    sm: {
      h: 3,
      w: 5,
      x: 5,
      y: 6,
    },
    xs: {
      h: 2,
      w: 6,
      x: 0,
      y: 20,
    },
    xxs: {
      h: 2,
      w: 4,
      x: 0,
      y: 28,
    },
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.studies.cardTitle'),
    id: STUDIES_GRAPH_CARD_ID,
    component: <StudiesGraphCard />,
    base: {
      h: 3,
      w: 2,
      x: 6,
      y: 4,
      minH: 2,
      minW: 2,
    },
    lg: {
      h: 3,
      w: 2,
      x: 6,
      y: 4,
    },
    md: {
      h: 3,
      w: 2,
      x: 6,
      y: 4,
    },
    sm: {
      h: 2,
      w: 3,
      x: 7,
      y: 4,
    },
    xs: {
      h: 3,
      w: 6,
      x: 0,
      y: 14,
    },
    xxs: {
      h: 3,
      w: 4,
      x: 0,
      y: 30,
    },
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.availableData.dataTypeTitle'),
    id: DATA_TYPE_GRAPH_CARD_ID,
    component: <DataTypeGraphCard />,
    base: {
      h: 4,
      w: 8,
      x: 0,
      y: 10,
      minH: 3,
      minW: 4,
    },
    lg: {
      h: 4,
      w: 8,
      x: 0,
      y: 10,
    },
    md: {
      h: 4,
      w: 8,
      x: 0,
      y: 10,
    },
    sm: {
      h: 4,
      w: 10,
      x: 0,
      y: 13,
    },
    xs: {
      h: 4,
      w: 6,
      x: 0,
      y: 25,
    },
    xxs: {
      h: 4,
      w: 4,
      x: 0,
      y: 33,
    },
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.availableData.sampleTypeTitle'),
    id: 'sample_type',
    component: <SampleTypeGraphCard />,
    base: {
      h: 3,
      w: 7,
      x: 8,
      y: 7,
      minH: 2,
      minW: 2,
    },
    lg: {
      h: 3,
      w: 7,
      x: 8,
      y: 7,
      minH: 2,
      minW: 2,
      moved: false,
      static: false,
    },
    md: {
      h: 3,
      w: 6,
      x: 0,
      y: 7,
      minH: 2,
      minW: 2,
      moved: false,
      static: false,
    },
    sm: {
      h: 4,
      w: 10,
      x: 0,
      y: 9,
      minH: 2,
      minW: 2,
      moved: false,
      static: false,
    },
    xs: {
      h: 3,
      w: 6,
      x: 0,
      y: 22,
      minH: 2,
      minW: 2,
      moved: false,
      static: false,
    },
    xxs: {
      h: 3,
      w: 6,
      x: 0,
      y: 37,
    },
  },
];
