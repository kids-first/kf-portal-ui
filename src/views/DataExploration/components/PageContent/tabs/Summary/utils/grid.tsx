import intl from 'react-intl-universal';
import { IResizableGridLayoutConfig } from '@ferlab/ui/core/layout/ResizableGridLayout';

import AgeAtDiagnosisGraphCard from '../AgeAtDiagnosisGraphCard';
import DataCategoryGraphCard from '../DataCategoryGraphCard';
import DataTypeGraphCard from '../DataTypeGraphCard';
import DemographicsGraphCard from '../DemographicGraphCard';
import StudiesGraphCard from '../StudiesGraphCard';
import SunburstGraphCard from '../SunburstGraphCard';

export const UID = 'summary';
export const OBSERVED_PHENOTYPE_ID = 'observed_phenotype';
export const MONDO_ID = 'mondo';
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
    base: {
      h: 4,
      w: 8,
      x: 0,
      y: 0,
      minW: 5,
      minH: 4,
      isResizable: false,
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
      h: 4,
      w: 6,
      x: 0,
      y: 0,
    },
    xss: {
      h: 4,
      w: 4,
      x: 0,
      y: 0,
    },
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.mondo.cardTitle'),
    id: MONDO_ID,
    component: <SunburstGraphCard id={MONDO_ID} field="mondo" />,
    base: {
      h: 4,
      w: 8,
      x: 8,
      y: 0,
      minW: 5,
      minH: 4,
      isResizable: false,
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
      h: 4,
      w: 6,
      x: 0,
      y: 4,
    },
    xss: {
      h: 4,
      w: 4,
      x: 0,
      y: 4,
    },
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.demographic.cardTitle'),
    id: DEMOGRAPHICS_GRAPH_CARD_ID,
    component: <DemographicsGraphCard />,
    base: {
      h: 2,
      w: 16,
      x: 0,
      y: 4,
      minW: 4,
      minH: 2,
    },
    lg: {
      h: 2,
      w: 16,
      x: 0,
      y: 4,
    },
    md: {
      h: 2,
      w: 12,
      x: 0,
      y: 4,
    },
    sm: {
      h: 2,
      w: 10,
      x: 0,
      y: 4,
    },
    xs: {
      h: 2,
      w: 6,
      x: 0,
      y: 8,
    },
    xss: {
      h: 2,
      w: 4,
      x: 0,
      y: 8,
    },
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.ageAtDiagnosis.cardTitle'),
    id: AGE_AT_DIAGNOSIS_GRAPH_CARD_ID,
    component: <AgeAtDiagnosisGraphCard />,
    base: {
      h: 2,
      w: 8,
      x: 0,
      y: 6,
      minW: 3,
      minH: 2,
    },
    lg: {
      h: 2,
      w: 8,
      x: 0,
      y: 6,
    },
    md: {
      h: 2,
      w: 6,
      x: 0,
      y: 6,
    },
    sm: {
      h: 2,
      w: 5,
      x: 0,
      y: 6,
    },
    xs: {
      h: 2,
      w: 6,
      x: 0,
      y: 10,
    },
    xss: {
      h: 2,
      w: 4,
      x: 0,
      y: 10,
    },
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.availableData.dataCategoryTitle'),
    id: DATA_CATEGORY_GRAPH_CARD_ID,
    component: <DataCategoryGraphCard />,
    base: {
      h: 2,
      w: 8,
      x: 8,
      y: 6,
      minW: 2,
      minH: 2,
    },
    lg: {
      h: 2,
      w: 8,
      x: 8,
      y: 6,
    },
    md: {
      h: 2,
      w: 6,
      x: 6,
      y: 6,
    },
    sm: {
      h: 2,
      w: 5,
      x: 5,
      y: 6,
    },
    xs: {
      h: 2,
      w: 6,
      x: 0,
      y: 12,
    },
    xss: {
      h: 2,
      w: 4,
      x: 0,
      y: 12,
    },
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.studies.cardTitle'),
    id: STUDIES_GRAPH_CARD_ID,
    component: <StudiesGraphCard />,
    base: {
      h: 3,
      w: 4,
      x: 0,
      y: 8,
      minW: 2,
      minH: 2,
    },
    lg: {
      h: 3,
      w: 4,
      x: 0,
      y: 8,
    },
    md: {
      h: 3,
      w: 4,
      x: 0,
      y: 8,
    },
    sm: {
      h: 3,
      w: 5,
      x: 0,
      y: 8,
    },
    xs: {
      h: 3,
      w: 6,
      x: 0,
      y: 14,
    },
    xss: {
      h: 3,
      w: 4,
      x: 0,
      y: 14,
    },
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.availableData.dataTypeTitle'),
    id: DATA_TYPE_GRAPH_CARD_ID,
    component: <DataTypeGraphCard />,
    base: {
      h: 3,
      w: 6,
      x: 4,
      y: 8,
      minW: 2,
      minH: 2,
    },
    lg: {
      h: 3,
      w: 6,
      x: 4,
      y: 8,
    },
    md: {
      h: 3,
      w: 7,
      x: 4,
      y: 8,
    },
    sm: {
      h: 4,
      w: 10,
      x: 0,
      y: 12,
    },
    xs: {
      h: 4,
      w: 6,
      x: 0,
      y: 17,
    },
    xss: {
      h: 4,
      w: 4,
      x: 0,
      y: 17,
    },
  },
];
