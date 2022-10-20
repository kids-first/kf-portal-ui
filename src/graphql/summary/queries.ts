export const DEMOGRAPHIC_QUERY = `
  query AggregationDemographicInfo($sqon: JSON) {
    participant {
      aggregations(filters: $sqon, aggregations_filter_themselves: true) {
        sex {
          buckets {
            key
            doc_count
          }
        }
        ethnicity {
          buckets {
            key
            doc_count
          }
        }
        race {
          buckets {
            key
            doc_count
          }
        }
      }
    }
  }
`;

export const DATATYPE_QUERY = `
  query($sqon: JSON) {
    participant {
      aggregations(filters: $sqon, aggregations_filter_themselves: true, include_missing: false) {
        files__data_type {
          buckets {
            key
            doc_count
          }
        }
      }
    }
  }
`;

export const PARTICIPANT_BY_STUDIES_QUERY = `
  query($sqon: JSON) {
    participant {
      aggregations(filters: $sqon, aggregations_filter_themselves: true, include_missing: false) {
        study__study_code {
          buckets {
            key
            doc_count
          }
        }
      }
    }
  }
`;

export const DATA_CATEGORY_QUERY = `
  query($sqon: JSON) {
    participant {
      aggregations(filters: $sqon, aggregations_filter_themselves: true, include_missing: false) {
        files__data_category {
          buckets {
            key
            doc_count
          }
        }
      }
    }
  }
`;

export const AGE_AT_DIAGNOSIS_QUERY = `
    query($sqon: JSON) {
      participant {
        _0to1: hits(
          filters: {
            op: "and"
            content: [
              $sqon
              { op: "<=", content: { field: "diagnosis.age_at_event_days", value: [364] } }
            ]
          }
        ) {
          total
        }
        _1to5: hits(
          filters: {
            op: "and"
            content: [
              $sqon
              {
                op: "between"
                content: { field: "diagnosis.age_at_event_days", value: [365, 1824] }
              }
            ]
          }
        ) {
          total
        }
        _5to10: hits(
          filters: {
            op: "and"
            content: [
              $sqon
              {
                op: "between"
                content: { field: "diagnosis.age_at_event_days", value: [1825, 3649] }
              }
            ]
          }
        ) {
          total
        }
        _10to15: hits(
          filters: {
            op: "and"
            content: [
              $sqon
              {
                op: "between"
                content: { field: "diagnosis.age_at_event_days", value: [3650, 5474] }
              }
            ]
          }
        ) {
          total
        }
        _15to18: hits(
          filters: {
            op: "and"
            content: [
              $sqon
              {
                op: "between"
                content: { field: "diagnosis.age_at_event_days", value: [5475, 6569] }
              }
            ]
          }
        ) {
          total
        }
        _18plus: hits(
          filters: {
            op: "and"
            content: [
              $sqon
              { op: ">=", content: { field: "diagnosis.age_at_event_days", value: [6570] } }
            ]
          }
        ) {
          total
        }
      }
    }
`;

export const SUNBURST_QUERY = `
  query ($sqon: JSON, $term_filters: JSON) {
    participant {
      aggregations(filters: $sqon, aggregations_filter_themselves: true) {
        observed_phenotype__name {
          buckets {
            key
            doc_count
            top_hits(_source: ["observed_phenotype.parents"], size: 1)
            filter_by_term(filter: $term_filters)
          }
        }
      }
    }
  }
`;
