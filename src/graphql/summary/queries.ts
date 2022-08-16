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
        study_id {
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
