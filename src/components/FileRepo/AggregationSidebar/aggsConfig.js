export const CLINICAL_FILTERS = [
  {
    field: 'participants__study__short_name',
    show: true,
    active: true,
  },
  {
    field: 'participants__diagnoses__diagnosis_category',
    show: true,
    active: true,
  },
  {
    field: 'participants__diagnoses__source_text_diagnosis',
    show: true,
    active: true,
  },
  {
    field: 'participants__family__family_compositions__composition',
    show: true,
    active: true,
  },
  {
    field: 'participants__is_proband',
    show: true,
    active: true,
  },
  {
    field: 'participants__gender',
    show: true,
    active: true,
  },
  {
    field: 'participants__race',
    show: true,
    active: true,
  },
  {
    field: 'participants__biospecimens__source_text_tissue_type',
    show: true,
    active: true,
  },
  {
    field: 'participants__study__external_id',
    show: true,
    active: true,
  },
  {
    field: 'participants__family__family_compositions__family_members__gender',
    show: false,
    active: true,
  },
  {
    field: 'participants__family__family_compositions__family_members__race',
    show: false,
    active: true,
  },
  {
    field: 'participants__family__family_compositions__family_members__ethnicity',
    show: false,
    active: true,
  },
  {
    field: 'participants__ethnicity',
    show: false,
    active: true,
  },
  {
    field: 'participants__family__family_compositions__family_members__is_proband',
    show: false,
    active: true,
  },
  {
    field: 'participants__study__name',
    show: false,
    active: true,
  },
  {
    field: 'participants__biospecimens__source_text_anatomical_site',
    show: false,
    active: true,
  },
  {
    field: 'participants__phenotype__hpo__source_text_phenotype',
    show: false,
    active: true,
  },
  {
    field: 'participants__biospecimens__composition',
    show: false,
    active: true,
  },
  {
    field: 'participants__study__kf_id',
    show: false,
    active: true,
  },
  {
    field: 'participants__biospecimens__ncit_id_anatomical_site',
    show: false,
    active: true,
  },
  {
    field: 'availability',
    show: false,
    active: true,
  },
  {
    field: 'controlled_access',
    show: false,
    active: true,
  },
  {
    field: 'created_at',
    show: false,
    active: true,
  },
  {
    field: 'external_id',
    show: false,
    active: true,
  },
  {
    field: 'file_name',
    show: false,
    active: true,
  },
  {
    field: 'kf_id',
    show: false,
    active: true,
  },
  {
    field: 'modified_at',
    show: false,
    active: true,
  },
  {
    field: 'participants__alias_group',
    show: false,
    active: true,
  },
  {
    field: 'participants__available_data_types',
    show: false,
    active: true,
  },
  {
    field: 'participants__biospecimens__age_at_event_days',
    show: false,
    active: true,
  },
  {
    field: 'participants__biospecimens__analyte_type',
    show: false,
    active: true,
  },
  {
    field: 'participants__biospecimens__concentration_mg_per_ml',
    show: false,
    active: true,
  },
  {
    field: 'participants__biospecimens__external_aliquot_id',
    show: false,
    active: true,
  },
  {
    field: 'participants__biospecimens__external_sample_id',
    show: false,
    active: true,
  },
  {
    field: 'participants__biospecimens__kf_id',
    show: false,
    active: true,
  },
  {
    field: 'participants__biospecimens__ncit_id_tissue_type',
    show: false,
    active: true,
  },
  {
    field: 'participants__biospecimens__participant_id',
    show: false,
    active: true,
  },
  {
    field: 'participants__biospecimens__sequencing_center_id',
    show: false,
    active: true,
  },
  {
    field: 'participants__biospecimens__shipment_date',
    show: false,
    active: true,
  },
  {
    field: 'participants__biospecimens__shipment_origin',
    show: false,
    active: true,
  },
  {
    field: 'participants__biospecimens__source_text_tumor_descriptor',
    show: false,
    active: true,
  },
  {
    field: 'participants__biospecimens__spatial_descriptor',
    show: false,
    active: true,
  },
  {
    field: 'participants__biospecimens__uberon_id_anatomical_site',
    show: false,
    active: true,
  },
  {
    field: 'participants__biospecimens__volume_ml',
    show: false,
    active: true,
  },
  {
    field: 'participants__consent_type',
    show: false,
    active: true,
  },
  {
    field: 'participants__diagnoses__age_at_event_days',
    show: false,
    active: true,
  },
  {
    field: 'participants__diagnoses__external_id',
    show: false,
    active: true,
  },
  {
    field: 'participants__diagnoses__icd_id_diagnosis',
    show: false,
    active: true,
  },
  {
    field: 'participants__diagnoses__kf_id',
    show: false,
    active: true,
  },
  {
    field: 'participants__diagnoses__mondo_id_diagnosis',
    show: false,
    active: true,
  },
  {
    field: 'participants__diagnoses__ncit_id_diagnosis',
    show: false,
    active: true,
  },
  {
    field: 'participants__diagnoses__participant_id',
    show: false,
    active: true,
  },
  {
    field: 'participants__diagnoses__source_text_tumor_location',
    show: false,
    active: true,
  },
  {
    field: 'participants__diagnoses__spatial_descriptor',
    show: false,
    active: true,
  },
  {
    field: 'participants__diagnoses__uberon_id_tumor_location',
    show: false,
    active: true,
  },
  {
    field: 'participants__external_id',
    show: false,
    active: true,
  },
  {
    field: 'participants__family__family_compositions__family_members__alias_group',
    show: false,
    active: true,
  },
  {
    field: 'participants__family__family_compositions__family_members__available_data_types',
    show: false,
    active: true,
  },
  {
    field: 'participants__family__family_compositions__family_members__consent_type',
    show: false,
    active: true,
  },
  {
    field:
      'participants__family__family_compositions__family_members__diagnoses__age_at_event_days',
    show: false,
    active: true,
  },
  {
    field:
      'participants__family__family_compositions__family_members__diagnoses__diagnosis_category',
    show: false,
    active: true,
  },
  {
    field: 'participants__family__family_compositions__family_members__diagnoses__external_id',
    show: false,
    active: true,
  },
  {
    field: 'participants__family__family_compositions__family_members__diagnoses__icd_id_diagnosis',
    show: false,
    active: true,
  },
  {
    field: 'participants__family__family_compositions__family_members__diagnoses__kf_id',
    show: false,
    active: true,
  },
  {
    field:
      'participants__family__family_compositions__family_members__diagnoses__mondo_id_diagnosis',
    show: false,
    active: true,
  },
  {
    field:
      'participants__family__family_compositions__family_members__diagnoses__ncit_id_diagnosis',
    show: false,
    active: true,
  },
  {
    field:
      'participants__family__family_compositions__family_members__diagnoses__source_text_diagnosis',
    show: false,
    active: true,
  },
  {
    field:
      'participants__family__family_compositions__family_members__diagnoses__source_text_tumor_location',
    show: false,
    active: true,
  },
  {
    field:
      'participants__family__family_compositions__family_members__diagnoses__spatial_descriptor',
    show: false,
    active: true,
  },
  {
    field:
      'participants__family__family_compositions__family_members__diagnoses__uberon_id_tumor_location',
    show: false,
    active: true,
  },
  {
    field: 'participants__family__family_compositions__family_members__external_id',
    show: false,
    active: true,
  },
  {
    field: 'participants__family__family_compositions__family_members__family_id',
    show: false,
    active: true,
  },
  {
    field: 'participants__family__family_compositions__family_members__kf_id',
    show: false,
    active: true,
  },
  {
    field: 'participants__family__family_compositions__family_members__outcome__age_at_event_days',
    show: false,
    active: true,
  },
  {
    field: 'participants__family__family_compositions__family_members__outcome__disease_related',
    show: false,
    active: true,
  },
  {
    field: 'participants__family__family_compositions__family_members__outcome__external_id',
    show: false,
    active: true,
  },
  {
    field: 'participants__family__family_compositions__family_members__outcome__kf_id',
    show: false,
    active: true,
  },
  {
    field: 'participants__family__family_compositions__family_members__outcome__participant_id',
    show: false,
    active: true,
  },
  {
    field: 'participants__family__family_compositions__family_members__outcome__vital_status',
    show: false,
    active: true,
  },
  {
    field:
      'participants__family__family_compositions__family_members__phenotype__hpo__age_at_event_days',
    show: false,
    active: true,
  },
  {
    field:
      'participants__family__family_compositions__family_members__phenotype__hpo__ancestral_hpo_ids',
    show: false,
    active: true,
  },
  {
    field: 'participants__family__family_compositions__family_members__phenotype__hpo__external_id',
    show: false,
    active: true,
  },
  {
    field:
      'participants__family__family_compositions__family_members__phenotype__hpo__shared_hpo_ids',
    show: false,
    active: true,
  },
  {
    field:
      'participants__family__family_compositions__family_members__phenotype__hpo__source_text_phenotype',
    show: false,
    active: true,
  },
  {
    field: 'participants__family__family_compositions__family_members__relationship',
    show: false,
    active: true,
  },
  {
    field: 'participants__family__family_compositions__shared_hpo_ids',
    show: false,
    active: true,
  },
  {
    field: 'participants__family__father_id',
    show: false,
    active: true,
  },
  {
    field: 'participants__family__mother_id',
    show: false,
    active: true,
  },
  {
    field: 'participants__family_id',
    show: false,
    active: true,
  },
  {
    field: 'participants__kf_id',
    show: false,
    active: true,
  },
  {
    field: 'participants__outcome__age_at_event_days',
    show: false,
    active: true,
  },
  {
    field: 'participants__outcome__disease_related',
    show: false,
    active: true,
  },
  {
    field: 'participants__outcome__external_id',
    show: false,
    active: true,
  },
  {
    field: 'participants__outcome__kf_id',
    show: false,
    active: true,
  },
  {
    field: 'participants__outcome__vital_status',
    show: false,
    active: true,
  },
  {
    field: 'participants__phenotype__hpo__age_at_event_days',
    show: false,
    active: true,
  },
  {
    field: 'participants__phenotype__hpo__ancestral_hpo_ids',
    show: false,
    active: true,
  },
  {
    field: 'participants__phenotype__hpo__external_id',
    show: false,
    active: true,
  },
  {
    field: 'participants__study__attribution',
    show: false,
    active: true,
  },
  {
    field: 'participants__study__data_access_authority',
    show: false,
    active: true,
  },
  {
    field: 'participants__study__investigator_id',
    show: false,
    active: true,
  },
  {
    field: 'participants__study__release_status',
    show: false,
    active: true,
  },
  {
    field: 'participants__study__version',
    show: false,
    active: true,
  },
  {
    field: 'reference_genome',
    show: false,
    active: true,
  },
  {
    field: 'sequencing_experiments__experiment_date',
    show: false,
    active: true,
  },
  {
    field: 'sequencing_experiments__external_id',
    show: false,
    active: true,
  },
  {
    field: 'sequencing_experiments__instrument_model',
    show: false,
    active: true,
  },
  {
    field: 'sequencing_experiments__is_paired_end',
    show: false,
    active: true,
  },
  {
    field: 'sequencing_experiments__kf_id',
    show: false,
    active: true,
  },
  {
    field: 'sequencing_experiments__library_name',
    show: false,
    active: true,
  },
  {
    field: 'sequencing_experiments__library_strand',
    show: false,
    active: true,
  },
  {
    field: 'sequencing_experiments__max_insert_size',
    show: false,
    active: true,
  },
  {
    field: 'sequencing_experiments__mean_depth',
    show: false,
    active: true,
  },
  {
    field: 'sequencing_experiments__mean_insert_size',
    show: false,
    active: true,
  },
  {
    field: 'sequencing_experiments__mean_read_length',
    show: false,
    active: true,
  },
  {
    field: 'sequencing_experiments__platform',
    show: false,
    active: true,
  },
  {
    field: 'sequencing_experiments__sequencing_center_id',
    show: false,
    active: true,
  },
  {
    field: 'sequencing_experiments__total_reads',
    show: false,
    active: true,
  },
  {
    field: 'size',
    show: false,
    active: true,
  },
  {
    field: 'latest_did',
    show: false,
    active: true,
  },
  {
    field: 'acl',
    type: 'Aggregations',
    show: false,
    active: true,
  },
  {
    field: 'participants__biospecimens__dbgap_consent_code',
    type: 'Aggregations',
    show: false,
    active: true,
  },
  {
    field: 'participants__diagnoses__biospecimen_id',
    type: 'Aggregations',
    show: false,
    active: true,
  },
  {
    field: 'participants__diagnoses__diagnosis',
    type: 'Aggregations',
    show: false,
    active: true,
  },
  {
    field: 'participants__family__family_compositions__family_members__diagnoses__biospecimen_id',
    type: 'Aggregations',
    show: false,
    active: true,
  },
  {
    field: 'participants__family__family_compositions__family_members__diagnoses__diagnosis',
    type: 'Aggregations',
    show: false,
    active: true,
  },
  {
    field:
      'participants__family__family_compositions__family_members__phenotype__hpo__hpo_phenotype_not_observed',
    type: 'Aggregations',
    show: false,
    active: true,
  },
  {
    field:
      'participants__family__family_compositions__family_members__phenotype__hpo__hpo_phenotype_observed',
    type: 'Aggregations',
    show: false,
    active: true,
  },
  {
    field:
      'participants__family__family_compositions__family_members__phenotype__hpo__snomed_phenotype_not_observed',
    type: 'Aggregations',
    show: false,
    active: true,
  },
  {
    field:
      'participants__family__family_compositions__family_members__phenotype__hpo__snomed_phenotype_observed',
    type: 'Aggregations',
    show: false,
    active: true,
  },
  {
    field: 'participants__phenotype__hpo__hpo_phenotype_not_observed',
    type: 'Aggregations',
    show: false,
    active: true,
  },
  {
    field: 'participants__phenotype__hpo__hpo_phenotype_observed',
    type: 'Aggregations',
    show: false,
    active: true,
  },
  {
    field: 'participants__phenotype__hpo__snomed_phenotype_not_observed',
    type: 'Aggregations',
    show: false,
    active: true,
  },
  {
    field: 'participants__phenotype__hpo__snomed_phenotype_observed',
    type: 'Aggregations',
    show: false,
    active: true,
  },
  {
    field: 'participants__family__family_id',
    type: 'Aggregations',
    show: false,
    active: true,
  },
];

export const FILE_FILTERS = [
  {
    field: 'sequencing_experiments__experiment_strategy',
    show: true,
    active: true,
  },
  {
    field: 'is_harmonized',
    show: true,
    active: true,
  },
  {
    field: 'data_type',
    show: true,
    active: true,
  },
  {
    field: 'file_format',
    show: true,
    active: true,
  },
  {
    field: 'participants__family__family_compositions__available_data_types',
    show: true,
    active: true,
  },
];
