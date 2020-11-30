import get from 'lodash/get';
import gql from 'graphql-tag';

export const SORTABLE_FIELDS_MAPPING = new Map([
  ['participantId', 'kf_id'],
  ['studyName', 'study.short_name'],
  ['isProband', 'is_proband'],
  ['vitalStatus', 'outcome.vital_status'],
  ['gender', 'gender'],
  ['familyId', 'family_id'],
]);

export const participantsQuery = (sqon, sort, pageSize = 20, pageIndex = 0) => ({
  query: gql`
    query($sqon: JSON, $pageSize: Int, $offset: Int, $sort: [Sort]) {
      participant {
        hits(first: $pageSize, offset: $offset, filters: $sqon, sort: $sort) {
          total
          edges {
            node {
              kf_id
              study {
                kf_id
                name
                short_name
              }
              is_proband
              outcome {
                vital_status
              }
              diagnoses {
                hits {
                  edges {
                    node {
                      age_at_event_days
                      diagnosis
                      mondo_id_diagnosis
                      diagnosis_category
                    }
                  }
                }
              }
              gender
              family_id
              family {
                family_compositions {
                  hits {
                    edges {
                      node {
                        composition
                      }
                    }
                  }
                }
              }
              files {
                hits {
                  total
                }
              }
            }
          }
        }
      }
    }
  `,
  variables: { sqon, pageSize, offset: pageSize * pageIndex, sort },
  transform: (data) => transformData(data),
});

export const participantQueryExport = (sqon, pageSize) => ({
  query: gql`
    query($sqon: JSON, $pageSize: Int) {
      participant {
        hits(filters: $sqon, first: $pageSize) {
          total
          edges {
            node {
              kf_id
              study {
                kf_id
                name
                short_name
              }
              is_proband
              outcome {
                vital_status
              }
              diagnoses {
                hits {
                  edges {
                    node {
                      age_at_event_days
                      diagnosis
                      mondo_id_diagnosis
                      diagnosis_category
                    }
                  }
                }
              }
              gender
              family_id
              family {
                family_compositions {
                  hits {
                    edges {
                      node {
                        composition
                      }
                    }
                  }
                }
              }
              files {
                hits {
                  total
                }
              }
            }
          }
        }
      }
    }
  `,
  variables: { sqon, pageSize },
  transform: (data) => transformData(data),
});

const transformData = (data) => {
  const participants = get(data, 'data.participant.hits.edges');
  const total = get(data, 'data.participant.hits.total');
  const nodes = participants.map((p) => p.node);

  return {
    total,
    nodes: nodes.map((node) => {
      const diagnosisCategories = get(node, 'diagnoses.hits.edges', []).map((edge) =>
        get(edge, 'node.diagnosis_category'),
      );
      const diagnosis = get(node, 'diagnoses.hits.edges', []).map((edge) =>
        get(edge, 'node.diagnosis'),
      );
      const diagnosisMondo = get(node, 'diagnoses.hits.edges', []).map((edge) =>
        get(edge, 'node.mondo_id_diagnosis'),
      );
      const ageAtDiagnosis = get(node, 'diagnoses.hits.edges', []).map((edge) =>
        get(edge, 'node.age_at_event_days'),
      );
      const familyCompositions = get(
        node,
        'family.family_compositions.hits.edges',
        [],
      ).map((edge) => get(edge, 'node.composition'));

      return {
        participantId: get(node, 'kf_id'),
        studyName: get(node, 'study.short_name'),
        studyId: get(node, 'study.kf_id'),
        isProband: get(node, 'is_proband', false) ? 'Yes' : 'No',
        vitalStatus: get(node, 'outcome.vital_status'),
        diagnosisCategories,
        diagnosis,
        diagnosisMondo,
        ageAtDiagnosis,
        gender: get(node, 'gender'),
        familyId: get(node, 'family_id'),
        familyCompositions,
        filesCount: get(node, 'files.hits.total'),
      };
    }),
  };
};
