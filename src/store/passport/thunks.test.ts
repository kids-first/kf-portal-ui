import { IFileEntity } from 'graphql/files/models';
import { FamilyType, Sex } from 'graphql/participants/models';

import { extractMetadata } from './thunks';

describe(`${extractMetadata.name}()`, () => {
  test('should handle edge case', () => {
    expect(extractMetadata({} as IFileEntity)).toEqual({});
  });
  test('should return well-formed metadata', () => {
    const file = {
      id: 'M8hthI0Bgzv7G1aX1IQR',
      external_id: 'drs://data.kidsfirstdrc.org/acb15d28-e1bc-40c6-9a32-e897e0bbb841',
      fhir_id: '517253',
      file_id: 'GF_000G102V',
      data_category: 'my_category',
      data_type: 'Simple Nucleotide Variations',
      file_format: 'maf',
      size: 5262930,
      controlled_access: 'Registered',
      access_urls: 'drs://data.kidsfirstdrc.org/acb15d28-e1bc-40c6-9a32-e897e0bbb841',
      acl: ['phs001436.c999', 'SD_DYPMEHHF'],
      file_name: '9b0afdf1-aad5-4e06-affa-d2e61111d318.strelka2_somatic.vep.maf',
      repository: 'gen3',
      nb_participants: 1,
      nb_biospecimens: 2,
      fhir_document_reference: 'http://localhost:8000/DocumentReference?identifier=GF_000G102V',
      participants: {
        hits: {
          edges: [
            {
              node: {
                participant_id: 'PT_EDKKJV31',
                external_id: 'GMKF-30-PARXDW03',
                is_proband: true,
                ethnicity: 'Not Hispanic or Latino',
                sex: Sex.FEMALE,
                race: 'White',
                families_id: 'FM_5ED41H3V',
                family_type: FamilyType.TRIO,
                family: {
                  family_id: 'FM_5ED41H3V',
                  relations_to_proband: {
                    hits: {
                      edges: [
                        {
                          node: {
                            role: 'mother',
                            participant_id: 'id1',
                            id: 'id1',
                          },
                        },
                        {
                          node: {
                            role: 'father',
                            participant_id: 'id2',
                            id: 'id2',
                          },
                        },
                        {
                          node: {
                            role: 'proband',
                            participant_id: 'id1',
                            id: 'id1',
                          },
                        },
                      ],
                    },
                  },
                },
                diagnosis: {
                  hits: {
                    total: 1,
                    edges: [
                      {
                        node: {
                          mondo_id_diagnosis: 'neuroblastoma (MONDO:0005072)',
                          source_text: 'Neuroblastoma',
                          ncit_id_diagnosis: 'NCIT:C3270',
                          age_at_event_days: 174,
                          id: 'id1234',
                          affected_status: true,
                          diagnosis_id: 'diag1234',
                        },
                      },
                    ],
                  },
                },
                outcomes: {
                  hits: {
                    total: 1,
                    edges: [
                      {
                        node: {
                          vital_status: 'Alive',
                          age_at_event_days: {
                            value: 3137,
                            units: 'day',
                          },
                        },
                      },
                    ],
                  },
                },
                phenotype: {
                  hits: {
                    edges: [
                      {
                        node: {
                          id: 'phenotype1234',
                          age_at_event_days: 31231,
                          source_text: 'mySourceText',
                          fhir_id: 'fhir123',
                          hpo_phenotype: 'hpo_phenotype',
                          hpo_phenotype_observed: 'hpo_phenotype_observed',
                          hpo_phenotype_observed_text: 'hpo_phenotype_observed_text',
                          hpo_phenotype_not_observed: 'hpo_phenotype_not_observed',
                          hpo_phenotype_not_observed_text: 'hpo_phenotype_not_observed_text',
                          is_observed: false,
                        },
                      },
                    ],
                  },
                },
                biospecimens: {
                  hits: {
                    edges: [
                      {
                        node: {
                          sample_id: '595495',
                          sample_type: 'DNA',
                          external_sample_id: '595495',
                          collection_sample_type: 'Buccal Cells',
                          age_at_biospecimen_collection: 2345,
                          collection_method_of_sample_procurement: 'blood',
                          dbgap_consent_code: 'phs001436.c1',
                          diagnoses: {
                            hits: {
                              total: 1,
                              edges: [
                                {
                                  node: {
                                    diagnosis_mondo: 'MONDO:0005072',
                                    source_text_tumor_descriptor: 'tumor',
                                    source_text_tumor_location: ['Reported Unknown'],
                                    source_text: 'Neuroblastoma',
                                    diagnosis_ncit: 'NCIT:C3270',
                                    age_at_event: {
                                      value: 174,
                                      units: 'day',
                                    },
                                  },
                                },
                              ],
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
      study: {
        study_id: 'SD_DYPMEHHF',
        study_name: 'Discovering the Genetic Basis of Human Neuroblastoma',
        study_code: 'KF-NBL',
        program: 'Kids First',
        domain: 'CANCER',
        experimental_strategy: [],
        family_count: 0,
        participant_count: 0,
        biospecimen_count: 0,
        data_category: [],
        family_data: false,
        controlled_access: [],
      },
      sequencing_experiment: {
        hits: {
          edges: [
            {
              node: {
                experiment_strategy: 'WGS',
                platform: 'Illumina',
                instrument_model: 'HiSeq X',
                library_strand: 'Unstranded',
                is_paired_end: true,
              },
            },
          ],
        },
      },
    };

    const expectedMetaData = {
      fhir_document_reference: 'http://localhost:8000/DocumentReference?identifier=GF_000G102V',
      file_id: 'GF_000G102V',
      external_file_id: 'drs://data.kidsfirstdrc.org/acb15d28-e1bc-40c6-9a32-e897e0bbb841',
      file_name: '9b0afdf1-aad5-4e06-affa-d2e61111d318.strelka2_somatic.vep.maf',
      data_category: 'my_category',
      data_type: 'Simple Nucleotide Variations',
      file_format: 'maf',
      repository: 'gen3',
      acl: 'phs001436.c999,SD_DYPMEHHF',
      access_url: 'drs://data.kidsfirstdrc.org/acb15d28-e1bc-40c6-9a32-e897e0bbb841',
      participant_ids: 'PT_EDKKJV31',
      external_participant_ids: 'GMKF-30-PARXDW03',
      proband: 'PT_EDKKJV31: true',
      ethnicity: 'Not Hispanic or Latino',
      sex: 'female',
      race: 'White',
      age_at_diagnosis: '174',
      age_at_vital_status: '3137',
      age_at_observed_phenotype: '31231',
      diagnosis_mondo: 'neuroblastoma (MONDO:0005072)',
      diagnosis_ncit: 'NCIT:C3270',
      diagnosis_source_text: 'Neuroblastoma',
      family_id: 'FM_5ED41H3V',
      family_composition: 'trio',
      family_role: 'mother,father,proband',
      observed_phenotype_hpo: 'hpo_phenotype_observed',
      not_observed_phenotype_hpo: 'hpo_phenotype_not_observed',
      observed_phenotype_source_text: 'hpo_phenotype_observed_text',
      vital_status: 'Alive',
      sample_id: '595495',
      sample_type: 'DNA',
      external_sample_id: '595495',
      collection_sample_type: 'Buccal Cells',
      age_at_biospecimen_collection: '2345',
      age_at_histological_diagnosis: '174',
      tumor_descriptor: 'tumor',
      method_of_sample_procurement: 'blood',
      tumor_location: 'Reported Unknown',
      histological_diagnosis_source_text: 'Neuroblastoma',
      histological_diagnosis_ncit: 'NCIT:C3270',
      histological_diagnosis_mondo: 'MONDO:0005072',
      dbgap_consent_code: 'phs001436.c1',
      experimental_strategy: 'WGS',
      platform: 'Illumina',
      instrument_model: 'HiSeq X',
      library_strand: 'Unstranded',
      is_paired_end: 'true',
      investigation: 'KF-NBL',
      study_name: 'Discovering the Genetic Basis of Human Neuroblastoma',
      study_program: 'Kids First',
      study_domain: 'CANCER',
    };

    expect(extractMetadata(file as unknown as IFileEntity)).toEqual(expectedMetaData);
  });
});
