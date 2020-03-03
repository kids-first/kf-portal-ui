// NOTE
// This file completely overrides the content of the `aggs-state` section of the arranger mappings,
//  for the sole purpose of splitting the filters into two tabs.

// Fields that will be displayed in the "Clinical Filters" section
export const CLINICAL_FILTERS = [
  'participants__study__short_name',
  'participants__diagnoses__diagnosis_category',
  'participants__diagnoses__source_text_diagnosis',
  'participants__phenotype__hpo_phenotype_observed_text',
  'participants__family__family_compositions__composition',
  'participants__is_proband',
  'participants__gender',
  'participants__race',
  'participants__biospecimens__source_text_tissue_type',
  'participants__study__external_id',
];

// Fields that will be displayed in the "File Filters" section
export const FILE_FILTERS = [
  'sequencing_experiments__experiment_strategy',
  'is_harmonized',
  'data_type',
  'file_format',
  'participants__family__family_compositions__available_data_types',
];

export const aggsConfig = (data, graphqlField) => {
  const {
    __schema: { types },
  } = data;

  const gqlAggregationFields = types.find(({ name }) => name === `${graphqlField}Aggregations`)
    .fields;

  const typeAggsConfig = type =>
    type.map(fieldName => ({
      field: fieldName,
      show: true,
      type: gqlAggregationFields.find(fileAggField => fieldName === fileAggField.name).type.name,
    }));

  return {
    FILE: typeAggsConfig(FILE_FILTERS),
    CLINICAL: typeAggsConfig(CLINICAL_FILTERS),
  };
};
