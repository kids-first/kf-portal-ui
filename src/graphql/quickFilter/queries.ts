import { gql } from '@apollo/client';

export const GET_QUICK_FILTER_EXPLO = gql`
  query getQuickFilterExploFacets($sqon: JSON) {
    participant {
      aggregations(filters: $sqon, include_missing: false) {
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
        # Toggle
        is_proband {
          buckets {
            key
            key_as_string
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
        # Range
        diagnosis__age_at_event_days {
          stats {
            count
          }
        }
        # Range
        outcomes__age_at_event_days__value {
          stats {
            count
          }
        }
        # Range
        phenotype__age_at_event_days {
          stats {
            count
          }
        }
        mondo__name {
          buckets {
            key
            doc_count
          }
        }
        diagnosis__ncit_display_term {
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
        # Range
        files__biospecimens__age_at_biospecimen_collection {
          stats {
            count
          }
        }
        # Range
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
        files__biospecimens__collection_ncit_anatomy_site {
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
        files__biospecimens__diagnoses__mondo_display_term {
          buckets {
            key
            doc_count
          }
        }
        files__biospecimens__diagnoses__ncit_display_term {
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
        # Toggle
        files__sequencing_experiment__is_paired_end {
          buckets {
            key
            key_as_string
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
