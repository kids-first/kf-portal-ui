import { get } from 'lodash';

export const demographicQuery = ({ sqon }) => ({
  query: `query ($sqon: JSON) {
    participant {
      hits(filters: $sqon) {
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
            family {
              family_id
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
  variables: sqon,
  transform: data => {
    const participants = get(data, 'data.participant.hits.edges');
    const vals = participants.map(p => p.node);
    return vals.map(datum => ({
      participantID: get(datum, 'kf_id'),
      studyName: get(datum, 'study.short_name'),
      isProband: get(datum, 'is_proband', false) ? 'Yes' : 'No',
      vitalStatus: get(datum, 'outcome.vital_status'),
    }));
  },
});
