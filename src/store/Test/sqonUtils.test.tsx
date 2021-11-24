import { shapeFileTypeSqonFiltersForParticipantType } from '../sqonUtils';

import { fileCentricSqon } from './mockData';

describe('SqonUtils', () => {
  describe('shapeFileTypeSqonFiltersForParticipantType', () => {
    it('should transform a file centric sqon into a participant centric sqon', async () => {
      expect(shapeFileTypeSqonFiltersForParticipantType(fileCentricSqon)).toEqual([
        { op: 'in', content: { field: 'files.file_format', value: ['fastq'] } },
        { op: 'in', content: { field: 'biospecimens.source_text_tissue_type', value: ['Normal'] } },
        {
          op: 'in',
          content: {
            field: 'family.family_compositions.available_data_types',
            value: ['Aligned Reads'],
          },
        },
        { op: 'in', content: { field: 'study.short_name', value: ['Kids First: Neuroblastoma'] } },
      ]);
    });
  });
});
