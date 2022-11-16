import { IQueryConfig } from '@ferlab/ui/core/graphql/types';

export const memberRolesOptions = [
  {
    key: 'research',
    value: 'Researcher',
  },
  {
    key: 'health',
    value: 'Healthcare Professional',
  },
  {
    key: 'patient',
    value: 'Patient/Family Member',
  },
  {
    key: 'community',
    value: 'Community Member',
  },
];

export const diseasesInterestOptions = [
  {
    key: 'patients-with-both-childhood-cancer-and-birth-defects',
    value: ' Patients With Both Childhood Cancer and Birth Defects',
  },
  {
    key: 'childhood-cancer',
    value: 'Childhood Cancer',
  },
  {
    key: 'cancer',
    value: 'Cancer',
  },
  {
    key: 'adolescent-idiopathic-scoliosis',
    value: 'Adolescent Idiopathic Scoliosis',
  },
  {
    key: 'cancer-Susceptibility',
    value: 'Cancer Susceptibility',
  },
  {
    key: 'congenital-diaphragmatic-hernia',
    value: 'Congenital Diaphragmatic Hernia',
  },
  {
    key: 'craniofacial-microsomia',
    value: 'Craniofacial Microsomia',
  },
  {
    key: 'disorders-of-sex-development2',
    value: 'Disorders of Sex Development',
  },
  {
    key: 'enchondromatosis',
    value: 'Enchondromatosis',
  },
  {
    key: 'ewing-sarcoma',
    value: 'Ewing Sarcoma',
  },
  {
    key: 'familial-leukemia',
    value: 'Familial Leukemia',
  },
  {
    key: 'hearing-loss',
    value: 'Hearing Loss',
  },
  {
    key: 'infantile-hemangiomas',
    value: 'Infantile Hemangiomas',
  },
  {
    key: 'neuroblastoma',
    value: 'Neuroblastoma',
  },
  {
    key: 'nonsyndromic-craniosynostosis',
    value: 'Nonsyndromic Craniosynostosis',
  },
  {
    key: 'orofacial-clefts',
    value: 'Orofacial Clefts',
  },
  {
    key: 'osteosarcoma',
    value: 'Osteosarcoma',
  },
  {
    key: 'structural-heart-other-defects',
    value: 'Structural Heart & Other Defects',
  },
  {
    key: 'syndromic-cranial-dysinnervation-disorders',
    value: 'Syndromic Cranial Dysinnervation Disorders',
  },
  {
    key: 'pediatric-brain-tumors',
    value: 'Pediatric Brain Tumors',
  },
];

export const studiesInterestOptions = [
  {
    key: 'orofacial-cleft-european-ancestry',
    value: 'Orofacial Cleft: European Ancestry',
  },
  {
    key: 'neuroblastoma-initiation-and-progression',
    value: 'Neuroblastoma Initiation and Progression',
  },
  {
    key: 'orofacial-cleft-latin-american',
    value: 'Orofacial Cleft: Latin American',
  },
  {
    key: 'disorders-of-sex-development',
    value: 'Disorders of Sex Development',
  },
  {
    key: 'adolescent-idiopathic-scoliosis',
    value: 'Adolescent Idiopathic Scoliosis',
  },
  {
    key: 'congenital-heart-defects',
    value: 'Congenital Heart Defects',
  },
  {
    key: 'pediatric-brain-tumors-cbttc',
    value: 'Pediatric Brain Tumors: CBTTC',
  },
  {
    key: 'ewing-sarcoma-genetic-risk',
    value: 'Ewing Sarcoma: Genetic Risk',
  },
  {
    key: 'congenital-diaphragmatic-hernia',
    value: 'Congenital Diaphragmatic Hernia',
  },
];

export const DEFAULT_PAGE_INDEX = 1;
export const DEFAULT_PAGE_SIZE = 25;

export const DEFAULT_QUERY_CONFIG: IQueryConfig = {
  pageIndex: DEFAULT_PAGE_INDEX,
  size: DEFAULT_PAGE_SIZE,
  sort: [],
};
