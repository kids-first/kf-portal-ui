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

export const AreaOfInterestOptions = [
  {
    key: 'adolescent-idiopathic-scoliosis',
    value: 'Adolescent Idiopathic Scoliosis',
  },
  {
    key: 'bladder-exstrophy-epispadias-complex',
    value: 'Bladder Exstrophy-Epispadias Complex',
  },
  {
    key: 'congenital-diaphragmatic-hernia',
    value: 'Congenital Diaphragmatic Hernia',
  },
  {
    key: 'congenital-heart-defects',
    value: 'Congenital Heart Defects',
  },
  {
    key: 'cornelia-de-lange-syndrome',
    value: 'Cornelia de Lange Syndrome',
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
    key: 'esophageal-atresia-tracheoesophageal',
    value: 'Esophageal Atresia & Tracheoesophageal',
  },
  {
    key: 'ewing-sarcoma-genetic-risk',
    value: 'Ewing Sarcoma - Genetic Risk',
  },
  {
    key: 'familial-leukemia',
    value: 'Familial Leukemia',
  },
  {
    key: 'hemangiomas-phace',
    value: 'Hemangiomas (PHACE)',
  },
  {
    key: 'intersections-of-cancer-structural-birth-defects',
    value: 'Intersections of Cancer & Structural Birth Defects',
  },
  {
    key: 'kidney-and-urinary-tract-defects',
    value: 'Kidney and Urinary Tract Defects',
  },
  {
    key: 'laterality-birth-defects',
    value: 'Laterality Birth Defects',
  },
  {
    key: 'leukemia-heart-defects-in-down-syndrome',
    value: 'Leukemia & Heart Defects in Down Syndrome',
  },
  {
    key: 'microtia-in-hispianic-populations',
    value: 'Microtia in Hispianic Populations',
  },
  {
    key: 'myeloid-malignancies',
    value: 'Myeloid Malignancies',
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
    key: 'novel-cancer-susceptibility-in-families-from-basic3',
    value: 'Novel Cancer Susceptibility in Families (from BASIC3)',
  },
  {
    key: 'orofacial-cleft-african-asian-ancestries',
    value: 'Orofacial Cleft - African & Asian Ancestries',
  },
  {
    key: 'orofacial-cleft-european-ancestry',
    value: 'Orofacial Cleft - European Ancestry',
  },
  {
    key: 'orofacial-cleft-latin-american-ancestry',
    value: 'Orofacial Cleft - Latin American Ancestry',
  },
  {
    key: 'osteosarcoma',
    value: 'Osteosarcoma',
  },
  {
    key: 'pediatric-cancer-studies',
    value: 'Pediatric Cancer Studies',
  },
  {
    key: 'syndromic-cranial-dysinnervation',
    value: 'Syndromic Cranial Dysinnervation',
  },
  {
    key: 't-cell-acute-lymphoblastic-leukemia-all',
    value: 'T-cell Acute Lymphoblastic Leukemia (ALL)',
  },
];

export const DEFAULT_PAGE_INDEX = 1;
export const DEFAULT_PAGE_SIZE = 20;

export const DEFAULT_QUERY_CONFIG: IQueryConfig = {
  pageIndex: DEFAULT_PAGE_INDEX,
  size: DEFAULT_PAGE_SIZE,
  sort: [],
};
