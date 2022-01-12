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
