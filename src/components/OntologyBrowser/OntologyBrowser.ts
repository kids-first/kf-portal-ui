import { isFeatureEnabled } from 'common/featuresToggles';

export const CATEGORY_FIELDS_TREE_BROWSER = isFeatureEnabled('mondoDiagnosis')
  ? ['mondo_diagnosis.name', 'observed_phenotype.name']
  : ['observed_phenotype.name'];

export const supportOntologyBrowser = (field: string) =>
  CATEGORY_FIELDS_TREE_BROWSER.includes(field);
