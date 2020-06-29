import {
  fileCentricSqon,
  fileCentricSqonWithoutSaveSet,
  fileCentricSqonWithSaveSet,
} from './mockData';
import {
  extractSaveSetIdsFromSqon,
  removeSaveSetFilters,
  shapeFileTypeSqonFiltersForParticipantType,
} from '../sqonUtils';

describe('SqonUtils', () => {
  describe('removeSaveSetFilters', () => {
    it('should remove sqon filter related to save set when there is a save set', () => {
      const sqonFilters = fileCentricSqonWithSaveSet.content;
      const sqonFiltersWithoutSaveSet = removeSaveSetFilters(sqonFilters);
      expect(sqonFiltersWithoutSaveSet).toEqual([
        {
          op: 'in',
          content: {
            field: 'participants.study.short_name',
            value: ['Kids First: Orofacial Cleft - European Ancestry'],
          },
        },
      ]);
    });

    it('should keep sqon filter intact when no save set', () => {
      const sqonFilters = fileCentricSqonWithoutSaveSet.content;
      expect(removeSaveSetFilters(sqonFilters)).toEqual(sqonFilters);
    });
  });

  describe('extractSaveSetIdsFromSqon', () => {
    it('should extract saveSet id when needed', () => {
      expect(extractSaveSetIdsFromSqon(fileCentricSqonWithSaveSet)).toEqual([
        '8df9c858-c1ca-45da-a3cf-2ac07b318911',
      ]);
    });

    it('should return an empty array when there is no save set', () => {
      expect(extractSaveSetIdsFromSqon(fileCentricSqonWithoutSaveSet)).toEqual([]);
    });
  });

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
