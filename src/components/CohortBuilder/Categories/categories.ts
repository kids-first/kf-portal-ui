import { isFeatureEnabled } from 'common/featuresToggles';

// Categories are arranged so that they display alphabetically on the cohort builder based on the display name from arranger.
//  Check fields on display to make sure they are in alphabetical order.
//TODO Remove all isFeatureEnabled when ready

export const CATEGORY_FIELDS = {
  // Results in the Search All will appear in that order.
  searchAll: [
    // Study
    'study.data_access_authority',
    'is_proband',
    'study.short_name',

    // Demographic
    'ethnicity',
    'gender',
    'race',

    // Clinical
    'affected_status',
    'diagnoses.age_at_event_days',
    'outcome.age_at_event_days',
    'observed_phenotype.age_at_event_days',
    `${
      isFeatureEnabled('mondoDiagnosis') ? 'diagnoses.mondo.name' : 'diagnoses.mondo_id_diagnosis'
    }`,
    'diagnoses.ncit_id_diagnosis',
    'diagnoses.source_text_diagnosis',
    'diagnoses.diagnosis_category',
    'family.family_compositions.composition',
    'family.family_compositions.shared_hpo_ids',
    'outcome.disease_related',
    'phenotype.source_text_phenotype',
    'phenotype.hpo_phenotype_not_observed',
    'observed_phenotype.name',
    'diagnoses.source_text_tumor_location',
    'outcome.vital_status',

    // Biospecimen
    'biospecimens.age_at_event_days',
    'biospecimens.diagnoses.age_at_event_days',
    'biospecimens.analyte_type',
    'biospecimens.source_text_anatomical_site',
    'biospecimens.ncit_id_anatomical_site',
    'biospecimens.composition',
    'biospecimens.consent_type',
    'biospecimens.diagnoses.mondo_id_diagnosis',
    'biospecimens.diagnoses.ncit_id_diagnosis',
    'biospecimens.diagnoses.source_text_diagnosis',
    'biospecimens.method_of_sample_procurement',
    'biospecimens.source_text_tissue_type',
    'biospecimens.ncit_id_tissue_type',
    'biospecimens.source_text_tumor_descriptor',

    // Available Data
    'available_data_types',
    'files.sequencing_experiments.experiment_strategy',
    'family.family_compositions.available_data_types',
  ],
  quickSearch: [
    'available_data_types',
    'diagnoses.diagnosis_category',
    'phenotype.hpo_phenotype_not_observed',
    'observed_phenotype.name',
    'is_proband',
    'study.short_name',
  ],
  study: ['study.data_access_authority', 'is_proband', 'study.short_name'],
  demographic: ['ethnicity', 'gender', 'race'],
  clinical: [
    'affected_status',
    'diagnoses.age_at_event_days',
    'outcome.age_at_event_days',
    'observed_phenotype.age_at_event_days',
    `${
      isFeatureEnabled('mondoDiagnosis') ? 'diagnoses.mondo.name' : 'diagnoses.mondo_id_diagnosis'
    }`,
    'diagnoses.ncit_id_diagnosis',
    'diagnoses.source_text_diagnosis',
    'diagnoses.diagnosis_category',
    'family.family_compositions.composition',
    'family.family_compositions.shared_hpo_ids',
    'outcome.disease_related',
    'phenotype.hpo_phenotype_not_observed',
    'observed_phenotype.name',
    'phenotype.source_text_phenotype',
    'diagnoses.source_text_tumor_location',
    'outcome.vital_status',
  ],
  biospecimen: [
    'biospecimens.age_at_event_days',
    'biospecimens.diagnoses.age_at_event_days',
    'biospecimens.analyte_type',
    'biospecimens.source_text_anatomical_site',
    'biospecimens.ncit_id_anatomical_site',
    'biospecimens.composition',
    'biospecimens.consent_type',
    'biospecimens.diagnoses.mondo_id_diagnosis',
    'biospecimens.diagnoses.ncit_id_diagnosis',
    'biospecimens.diagnoses.source_text_diagnosis',
    'biospecimens.method_of_sample_procurement',
    'biospecimens.source_text_tissue_type',
    'biospecimens.ncit_id_tissue_type',
    'biospecimens.source_text_tumor_descriptor',
  ],
  availableData: [
    'available_data_types',
    'files.sequencing_experiments.experiment_strategy',
    'family.family_compositions.available_data_types',
  ],
};
