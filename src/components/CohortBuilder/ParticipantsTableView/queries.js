import { get } from 'lodash';

export const participantsQuery = (sqon, pageSize = 20, pageIndex = 0) => ({
  query: `query ($sqon: JSON) {
    participant {
      hits(first:${pageSize} offset:${pageSize * pageIndex} filters: $sqon) {
        total
        edges {
          node {
            kf_id
            study {
              name
              short_name
            }
            is_proband
            outcome {
              vital_status
            }
            diagnosis_category
            diagnoses{
              hits {
                edges {
                  node {
                    age_at_event_days
                    diagnosis
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
              hits{
                total
              }
            }
          }
        }
      }
    }
  }`,
  variables: { sqon },
  transform: data => {
    const participants = get(data, 'data.participant.hits.edges');
    const total = get(data, 'data.participant.hits.total');
    const nodes = participants.map(p => p.node);

    return {
      total,
      nodes: nodes.map(node => {
        const diagnosisCategories = get(node, 'diagnoses.hits.edges', []).map(edge =>
          get(edge, 'node.diagnosis_category'),
        );
        const diagnosis = get(node, 'diagnoses.hits.edges', []).map(edge =>
          get(edge, 'node.diagnosis'),
        );
        const ageAtDiagnosis = get(node, 'diagnoses.hits.edges', []).map(edge =>
          get(edge, 'node.age_at_event_days'),
        );
        const familyCompositions = get(node, 'family.family_compositions.hits.edges', []).map(
          edge => get(edge, 'node.composition'),
        );

        return {
          participantId: get(node, 'kf_id'),
          studyName: get(node, 'study.short_name'),
          isProband: get(node, 'is_proband', false) ? 'Yes' : 'No',
          vitalStatus: get(node, 'outcome.vital_status'),
          diagnosisCategories,
          diagnosis,
          ageAtDiagnosis,
          gender: get(node, 'gender'),
          familyId: get(node, 'family_id'),
          familyCompositions,
          filesCount: get(node, 'files.hits.total'),
        };
      }),
    };
  },
});

export const cohortResults = sqon => ({
  query: `query ($sqon: JSON) {
    participant {
      hits(filters: $sqon) {
        total
      }
      aggregations(filters: $sqon) {
        files__kf_id {
          buckets {
            key
          }
        }
      }
    }
  }`,
  variables: { sqon },
  transform: data => {
    const participants = get(data, 'data.participant.hits.total', 0);
    const files = get(data, 'data.participant.aggregations.files__kf_id.buckets', []).length;
    return {
      participantCount: participants,
      filesCount: files,
    };
  },
});
