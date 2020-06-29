export const fileCentricSqonWithSaveSet = {
  op: 'and',
  content: [
    {
      op: 'in',
      content: {
        field: 'participants.kf_id',
        value: 'set_id:8df9c858-c1ca-45da-a3cf-2ac07b318911',
      },
    },
    {
      op: 'in',
      content: {
        field: 'participants.study.short_name',
        value: ['Kids First: Orofacial Cleft - European Ancestry'],
      },
    },
  ],
};

export const fileCentricSqonWithoutSaveSet = {
  op: 'and',
  content: [
    {
      op: 'in',
      content: {
        field: 'participants.phenotype.hpo_phenotype_observed_text',
        value: ['Cleft lip (HP:0410030)'],
      },
    },
    {
      op: 'in',
      content: {
        field: 'participants.study.short_name',
        value: ['Kids First: Orofacial Cleft - European Ancestry'],
      },
    },
  ],
};

export const fileCentricSqon = {
  op: 'and',
  content: [
    { op: 'in', content: { field: 'file_format', value: ['fastq'] } },
    {
      op: 'in',
      content: { field: 'participants.biospecimens.source_text_tissue_type', value: ['Normal'] },
    },
    {
      op: 'in',
      content: {
        field: 'participants.family.family_compositions.available_data_types',
        value: ['Aligned Reads'],
      },
    },
    {
      op: 'in',
      content: { field: 'participants.study.short_name', value: ['Kids First: Neuroblastoma'] },
    },
  ],
};
