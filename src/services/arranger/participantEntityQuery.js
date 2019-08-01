export default `query ($sqon: JSON) {
  participant {
    hits(filters: $sqon) {
      edges {
        node {
          kf_id
          affected_status
          alias_group
          available_data_types
          ethnicity
          external_id
          family_id
          gender
          is_proband
          race
          biospecimens {
            hits {
              edges {
                node {
                  age_at_event_days
                  analyte_type
                  composition
                  concentration_mg_per_ml
                  consent_type
                  dbgap_consent_code
                  external_aliquot_id
                  external_sample_id
                  kf_id
                  method_of_sample_procurement
                  ncit_id_anatomical_site
                  ncit_id_tissue_type
                  sequencing_center_id
                  shipment_date
                  shipment_origin
                  source_text_anatomical_site
                  source_text_tissue_type
                  source_text_tumor_descriptor
                  spatial_descriptor
                  uberon_id_anatomical_site
                  volume_ul
                }
              }
            }
          }
          diagnoses {
            hits {
              edges {
                node {
                  age_at_event_days
                  diagnosis_category
                  diagnosis
                  external_id
                  icd_id_diagnosis
                  mondo_id_diagnosis
                  ncit_id_diagnosis
                  source_text_diagnosis
                  source_text_tumor_location
                  spatial_descriptor
                  uberon_id_tumor_location
                }
              }
            }
          }
          family {
            family_compositions {
              hits {
                edges {
                  node {
                    composition
                    shared_hpo_ids
                    family_members {
                      hits {
                        edges {
                          node {
                            affected_status
                            diagnosis_category
                            ethnicity
                            external_id
                            gender
                            race
                            relationship
                            kf_id
                            is_proband
                            phenotype {
                              hits {
                                edges {
                                  node {
                                    observed
                                    age_at_event_days
                                    external_id
                                    hpo_phenotype_not_observed
                                    hpo_phenotype_observed
                                    hpo_phenotype_observed_text
                                    ancestral_hpo_ids
                                    snomed_phenotype_not_observed
                                    snomed_phenotype_observed
                                    source_text_phenotype
                                  }
                                }
                              }
                            }
                            diagnoses {
                              hits {
                                edges {
                                  node {
                                    age_at_event_days
                                    diagnosis_category
                                    diagnosis
                                    external_id
                                    icd_id_diagnosis
                                    mondo_id_diagnosis
                                    ncit_id_diagnosis
                                    source_text_diagnosis
                                    source_text_tumor_location
                                    spatial_descriptor
                                    uberon_id_tumor_location
                                  }
                                }
                              }
                            }
                            outcome {
                              age_at_event_days
                              disease_related
                              external_id
                              vital_status
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          files {
            hits {
              edges {
                node {
                  acl
                  availability
                  controlled_access
                  created_at
                  data_type
                  external_id
                  file_format
                  file_name
                  is_harmonized
                  kf_id
                  latest_did
                  modified_at
                  reference_genome
                  size
                  repository
                  sequencing_experiments {
                    hits {
                      edges {
                        node {
                          experiment_date
                          experiment_strategy
                          external_id
                          instrument_model
                          is_paired_end
                          kf_id
                          library_strand
                          max_insert_size
                          mean_depth
                          mean_insert_size
                          mean_read_length
                          platform
                          sequencing_center_id
                          total_reads
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          outcome {
            age_at_event_days
            disease_related
            external_id
            vital_status
          }
          study {
            attribution
            data_access_authority
            external_id
            investigator_id
            kf_id
            name
            release_status
            short_name
            version
          }
          phenotype {
            hits {
              edges {
                node {
                  observed
                  age_at_event_days
                  external_id
                  hpo_phenotype_not_observed
                  hpo_phenotype_observed
                  hpo_phenotype_observed_text
                  ancestral_hpo_ids
                  snomed_phenotype_not_observed
                  snomed_phenotype_observed
                  source_text_phenotype
                }
              }
            }
          }
        }
      }
    }
  }
}
`;


/*
files {
            hits {
              edges {
                node {
                  id
                  acl
                  availability
                  controlled_access
                  created_at
                  data_type
                  external_id
                  file_format
                  file_name
                  is_harmonized
                  kf_id
                  latest_did
                  modified_at
                  reference_genome
                  size
                  sequencing_experiments {
                    hits {
                      edges {
                        node {
                          experiment_date
                          experiment_strategy
                          external_id
                          instrument_model
                          is_paired_end
                          kf_id
                          library_strand
                          max_insert_size
                          mean_depth
                          mean_insert_size
                          mean_read_length
                          platform
                          sequencing_center_id
                          total_reads
                        }
                      }
                    }
                  }
                }
              }
            }
          }
 */

/*

                            phenotype {
                              hits {
                                edges {
                                  node {
                                    age_at_event_days
                                    external_id
                                    hpo_phenotype_not_observed
                                    hpo_phenotype_observed
                                    hpo_phenotype_observed_text
                                    shared_hpo_ids
                                    snomed_phenotype_not_observed
                                    snomed_phenotype_observed
                                    source_text_phenotype
                                  }
                                }
                              }
                            }
 */