import { IQueryConfig } from '@ferlab/ui/core/graphql/types';

export const ROLE_OPTIONS = [
  {
    value: 'research',
    label: 'Researcher',
  },
  {
    value: 'health',
    label: 'Healthcare Professional',
  },
  {
    value: 'patient',
    label: 'Patient/Family Member',
  },
  {
    value: 'community',
    label: 'Community Member',
  },
];

export const AREA_OF_INTEREST = [
  'Adolescent Idiopathic Scoliosis',
  'Bladder Exstrophy-Epispadias Complex',
  'Congenital Diaphragmatic Hernia',
  'Congenital Heart Defects',
  'Cornelia de Lange Syndrome',
  'Craniofacial Microsomia',
  'Disorders of Sex Development',
  'Enchondromatosis',
  'Esophageal Atresia & Tracheoesophageal',
  'Ewing Sarcoma - Genetic Risk',
  'Familial Leukemia',
  'Hemangiomas (PHACE)',
  'Intersections of Cancer & Structural Birth Defects',
  'Kidney and Urinary Tract Defects',
  'Laterality Birth Defects',
  'Leukemia & Heart Defects in Down Syndrome',
  'Microtia in Hispianic Populations',
  'Myeloid Malignancies',
  'Neuroblastoma',
  'Nonsyndromic Craniosynostosis',
  'Novel Cancer Susceptibility in Families (from BASIC3)',
  'Orofacial Cleft - African & Asian Ancestries',
  'Orofacial Cleft - European Ancestry',
  'Orofacial Cleft - Latin American Ancestry',
  'Osteosarcoma',
  'Pediatric Cancer Studies',
  'Syndromic Cranial Dysinnervation',
  'T-cell Acute Lymphoblastic Leukemia (ALL)',
];

export const AREA_OF_INTEREST_OPTIONS = AREA_OF_INTEREST.map((option) => ({
  label: option,
  value: option,
}));

export const DEFAULT_PAGE_INDEX = 1;
export const DEFAULT_PAGE_SIZE = 20;

export const DEFAULT_QUERY_CONFIG: IQueryConfig = {
  pageIndex: DEFAULT_PAGE_INDEX,
  size: DEFAULT_PAGE_SIZE,
  sort: [],
};
