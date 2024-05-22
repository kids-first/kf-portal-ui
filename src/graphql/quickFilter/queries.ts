import { gql } from '@apollo/client';

export const dataExploQFFacets = [
  'study__study_name',
  'study__study_code',
  'study__program',
  'study__domain',
  'study__external_id',
  'is_proband',
  'ethnicity',
  'sex',
  'race',
  'diagnosis__age_at_event_days',
  'outcomes__age_at_event_days__value',
  'phenotype__age_at_event_days',
  'diagnosis__ncit_id_diagnosis',
  'diagnosis__source_text',
  'family_type',
  'observed_phenotype__name',
  'phenotype__hpo_phenotype_not_observed',
  'phenotype__source_text',
  'outcomes__vital_status',
  'files__biospecimens__sample_type',
  'files__biospecimens__collection_sample_type',
  'files__biospecimens__age_at_biospecimen_collection',
  'files__biospecimens__diagnoses__age_at_event__value',
  'files__biospecimens__status',
  'files__biospecimens__collection_ncit_anatomy_site_id',
  'files__biospecimens__collection_anatomy_site',
  'files__biospecimens__consent_type',
  'files__biospecimens__dbgap_consent_code',
  'files__biospecimens__diagnoses__diagnosis_mondo',
  'files__biospecimens__diagnoses__diagnosis_ncit',
  'files__biospecimens__diagnoses__source_text',
  'files__biospecimens__diagnoses__source_text_tumor_location',
  'files__biospecimens__collection_method_of_sample_procurement',
  'files__biospecimens__diagnoses__source_text_tumor_descriptor',
  'files__controlled_access',
  'files__data_category',
  'files__data_type',
  'files__sequencing_experiment__experiment_strategy',
  'files__file_format',
  'files__sequencing_experiment__platform',
  'files__sequencing_experiment__instrument_model',
  'files__sequencing_experiment__library_strand',
  'files__sequencing_experiment__is_paired_end',
  'files__repository',
  'files__acl',
];

// TODO add method to generate this query with facets array dataExploQFFacets
export const GET_QUICK_FILTER_EXPLO = gql`
  query getQuickFilterExploFacets($sqon: JSON) {
    participant {
      aggregations(filters: $sqon, aggregations_filter_themselves: true, include_missing: false) {
        study__study_name {
          buckets {
            key
            doc_count
          }
        }
        study__study_code {
          buckets {
            key
            doc_count
          }
        }
        study__program {
          buckets {
            key
            doc_count
          }
        }
        study__domain {
          buckets {
            key
            doc_count
          }
        }
        study__external_id {
          buckets {
            key
            doc_count
          }
        }
        is_proband {
          buckets {
            key
            doc_count
          }
        }
        ethnicity {
          buckets {
            key
            doc_count
          }
        }
        sex {
          buckets {
            key
            doc_count
          }
        }
        race {
          buckets {
            key
            doc_count
          }
        }
        diagnosis__age_at_event_days {
          stats {
            count
          }
        }
        outcomes__age_at_event_days__value {
          stats {
            count
          }
        }
        phenotype__age_at_event_days {
          stats {
            count
          }
        }
        diagnosis__ncit_id_diagnosis {
          buckets {
            key
            doc_count
          }
        }
        diagnosis__source_text {
          buckets {
            key
            doc_count
          }
        }
        family_type {
          buckets {
            key
            doc_count
          }
        }
        observed_phenotype__name {
          buckets {
            key
            doc_count
          }
        }
        phenotype__hpo_phenotype_not_observed {
          buckets {
            key
            doc_count
          }
        }
        phenotype__source_text {
          buckets {
            key
            doc_count
          }
        }
        outcomes__vital_status {
          buckets {
            key
            doc_count
          }
        }

        files__biospecimens__sample_type {
          buckets {
            key
            doc_count
          }
        }
        files__biospecimens__collection_sample_type {
          buckets {
            key
            doc_count
          }
        }
        files__biospecimens__age_at_biospecimen_collection {
          stats {
            count
          }
        }
        files__biospecimens__diagnoses__age_at_event__value {
          stats {
            count
          }
        }
        files__biospecimens__status {
          buckets {
            key
            doc_count
          }
        }
        files__biospecimens__collection_ncit_anatomy_site_id {
          buckets {
            key
            doc_count
          }
        }
        files__biospecimens__collection_anatomy_site {
          buckets {
            key
            doc_count
          }
        }
        files__biospecimens__consent_type {
          buckets {
            key
            doc_count
          }
        }
        files__biospecimens__dbgap_consent_code {
          buckets {
            key
            doc_count
          }
        }
        files__biospecimens__diagnoses__diagnosis_mondo {
          buckets {
            key
            doc_count
          }
        }
        files__biospecimens__diagnoses__diagnosis_ncit {
          buckets {
            key
            doc_count
          }
        }
        files__biospecimens__diagnoses__source_text {
          buckets {
            key
            doc_count
          }
        }
        files__biospecimens__diagnoses__source_text_tumor_location {
          buckets {
            key
            doc_count
          }
        }
        files__biospecimens__collection_method_of_sample_procurement {
          buckets {
            key
            doc_count
          }
        }
        files__biospecimens__diagnoses__source_text_tumor_descriptor {
          buckets {
            key
            doc_count
          }
        }

        files__controlled_access {
          buckets {
            key
            doc_count
          }
        }
        files__data_category {
          buckets {
            key
            doc_count
          }
        }
        files__data_type {
          buckets {
            key
            doc_count
          }
        }
        files__sequencing_experiment__experiment_strategy {
          buckets {
            key
            doc_count
          }
        }
        files__file_format {
          buckets {
            key
            doc_count
          }
        }
        files__sequencing_experiment__platform {
          buckets {
            key
            doc_count
          }
        }
        files__sequencing_experiment__instrument_model {
          buckets {
            key
            doc_count
          }
        }
        files__sequencing_experiment__library_strand {
          buckets {
            key
            doc_count
          }
        }
        files__sequencing_experiment__is_paired_end {
          buckets {
            key
            doc_count
          }
        }
        files__repository {
          buckets {
            key
            doc_count
          }
        }
        files__acl {
          buckets {
            key
            doc_count
          }
        }
      }
    }
  }
`;
