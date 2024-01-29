import { IFileEntity } from 'graphql/files/models';

import { metadata } from './thunks';

describe(`${metadata.name}()`, () => {
  test('should handle edge case', () => {
    expect(metadata({} as IFileEntity)).toEqual({});
  });
  test('should return well-formed metadata', () => {
    const file = {
      fhir_id: '1038816',
      file_id: 'GF_001JWT9N',
      participants: {
        hits: {
          edges: [
            {
              node: {
                participant_id: 'PT_G16VK7FR',
                is_proband: false,
                biospecimens: { hits: { edges: [{ node: { sample_type: 'RNA' } }] } },
              },
            },
          ],
        },
      },
      fhir_document_reference: 'http://localhost:8000/DocumentReference?identifier=GF_001JWT9N',
      study: {
        study_id: 'SD_8Y99QZJJ',
        study_name: 'Pediatric Brain Tumor Atlas: PNOC',
        study_code: 'PBTA-PNOC',
      },
      sequencing_experiment: {
        hits: { edges: [{ node: { experiment_strategy: 'RNA-Seq', platform: 'Illumina' } }] },
      },
    };
    expect(metadata(file as IFileEntity)).toEqual({
      fhir_document_reference: 'http://localhost:8000/DocumentReference?identifier=GF_001JWT9N',
      participants: 'PT_G16VK7FR',
      platform: 'Illumina',
      experimental_strategy: 'RNA-Seq',
      investigation: 'PBTA-PNOC',
      sample_type: 'RNA',
    });
  });
});
