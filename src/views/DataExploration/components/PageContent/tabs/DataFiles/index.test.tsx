import { IFileEntity } from 'graphql/files/models';

import { getDefaultColumns } from './index';
describe('getDefaultColumns', () => {
  let fileEntity = {} as IFileEntity;

  beforeEach(() => {
    fileEntity = {
      id: 'fileId',
      acl: [],
      //@ts-ignore
      biospecimens: { hits: { edges: [{ node: { id: 'test' } }] } },
      controlled_access: '',
      access_urls: '',
      data_category: '',
      data_type: '',
      external_id: '',
      fhir_document_reference: '',
      fhir_id: '',
      file_format: '',
      file_id: '',
      file_name: '',
      hashes: {
        etag: '',
        md5: '',
      },
      is_harmonized: false,
      nb_participants: 3,
      nb_biospecimens: 3,
      participants: {
        hits: {
          edges: [
            {
              //@ts-ignore is irrelevant for this test
              node: {},
            },
          ],
        },
      },
      repository: '',
      study: {
        id: 'study test',
        study_id: 'study test',
        fhir_id: 'study test',
        study_code: 'study test',
        study_name: 'study test',
        external_id: 'study test',
        experimental_strategy: [],
        family_count: 4,
        participant_count: 4,
        biospecimen_count: 4,
        data_category: [],
        family_data: false,
        controlled_access: [],
      },
      score: 3,
      sequencing_experiment: {
        hits: {
          edges: [
            {
              node: {
                id: 'seqtest',
                sequencing_experiment_id: 'seq test',
                experiment_strategy: 'seq test',
                center: 'seq test',
                library_name: 'seq test',
                library_prep: 'seq test',
                library_selection: 'seq test',
                library_strand: 'seq test',
                platform: 'seq test',
                instrument_model: 'seq test',
                sequencing_center_id: 'seq test',
              },
            },
            {
              node: {
                id: 'seqtest 2',
                sequencing_experiment_id: 'seq test 2',
                experiment_strategy: 'seq test 2',
                center: 'seq test 2',
                library_name: 'seq test 2',
                library_prep: 'seq test 2',
                library_selection: 'seq test 2',
                library_strand: 'seq test 2',
                platform: 'seq test 2',
                instrument_model: 'seq test 2',
                sequencing_center_id: 'seq test 2',
              },
            },
          ],
        },
      },
      size: 3,
    };
  });

  test('sequencing experiment render should only disply first element', () => {
    const defaultColumns = getDefaultColumns([], false, false);
    const result = defaultColumns.filter(
      (column) => column.key === 'sequencing_experiment.experiment_strategy',
    );
    let seqExp = null;
    //@ts-ignore render has badly defined expected type
    seqExp = result?.length > 0 ? result[0].render(fileEntity) : undefined;

    expect(seqExp).toEqual('seq test');
  });

  test('sequencing experiment render should display - when no data available', () => {
    const defaultColumns = getDefaultColumns([], false, false);
    const result = defaultColumns.filter(
      (column) => column.key === 'sequencing_experiment.experiment_strategy',
    );
    fileEntity.sequencing_experiment.hits.edges = [];

    let seqExp = null;
    //@ts-ignore render has badly defined expected type
    seqExp = result?.length > 0 ? result[0].render(fileEntity) : undefined;

    expect(seqExp).toEqual('-');
  });
});
