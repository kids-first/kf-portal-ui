import { gql } from '@apollo/client';

import { ExtendedMapping } from 'components/Utils/utils';
import { dotToUnderscore, underscoreToDot } from 'store/graphql/utils';
import { MappingResults } from 'store/graphql/utils/actions';

export const VARIANT_QUERY = gql`
  query VariantInformation(
    $sqon: JSON
    $pageSize: Int
    $offset: Int
    $sort: [Sort]
    $studiesSize: Int
  ) {
    variants {
      hits(filters: $sqon, first: $pageSize, offset: $offset, sort: $sort) {
        total
        edges {
          node {
            id
            hgvsg
            hash
            locus
            variant_class
            clinvar {
              clinvar_id
              clin_sig
            }
            rsnumber
            participant_number
            participant_frequency
            participant_total_number
            consequences {
              hits {
                edges {
                  node {
                    symbol
                    canonical
                    vep_impact
                    symbol
                    consequences
                    aa_change
                    impact_score
                  }
                }
              }
            }
            frequencies {
              internal {
                lower_bound_kf {
                  homozygotes
                  af
                  an
                  ac
                  heterozygotes
                }
                upper_bound_kf {
                  homozygotes
                  af
                  an
                  ac
                  heterozygotes
                }
              }
            }
            studies {
              hits {
                edges {
                  node {
                    study_id
                    participant_ids
                    participant_number
                  }
                }
                total
              }
            }
            genes {
              hits {
                edges {
                  node {
                    symbol
                  }
                }
              }
            }
          }
        }
      }
    }
    studies {
      hits(first: $studiesSize) {
        edges {
          node {
            id
            code
            domain
          }
        }
      }
    }
  }
`;

export const TAB_FREQUENCIES_QUERY = gql`
  query GetFrequenciesTabVariant($sqon: JSON, $studiesSize: Int) {
    variants {
      hits(filters: $sqon) {
        edges {
          node {
            locus
            participant_number
            frequencies {
              topmed {
                ac
                af
                an
                homozygotes
                heterozygotes
              }
              one_thousand_genomes {
                ac
                af
                an
              }
              gnomad_exomes_2_1 {
                ac
                af
                an
                homozygotes
              }
              gnomad_genomes_2_1 {
                ac
                af
                an
                homozygotes
              }
              gnomad_genomes_3_0 {
                ac
                af
                an
                homozygotes
              }
              internal {
                lower_bound_kf {
                  ac
                  af
                  an
                  heterozygotes
                  homozygotes
                }
                upper_bound_kf {
                  ac
                  af
                  an
                  heterozygotes
                  homozygotes
                }
              }
            }
            participant_number
            participant_number_visible
            participant_total_number
            participant_frequency
            studies {
              hits {
                edges {
                  node {
                    frequencies {
                      lower_bound_kf {
                        ac
                        af
                        an
                        heterozygotes
                        homozygotes
                      }
                      upper_bound_kf {
                        ac
                        af
                        an
                        heterozygotes
                        homozygotes
                      }
                    }
                    participant_number
                    participant_ids
                    study_id
                  }
                }
              }
            }
          }
        }
      }
    }
    studies {
      hits(first: $studiesSize) {
        edges {
          node {
            code
            id
            domain
          }
        }
      }
    }
  }
`;

export const TAB_SUMMARY_CLINICAL_QUERY = gql`
  query GetSummaryTabVariant($sqon: JSON) {
    variants {
      hits(filters: $sqon) {
        total
        edges {
          node {
            alternate
            chromosome
            hgvsg
            hash
            locus
            clinvar {
              clinvar_id
              clin_sig
              conditions
              inheritance
            }
            rsnumber
            reference
            start
            participant_number
            participant_frequency
            variant_class
            consequences {
              hits {
                edges {
                  node {
                    biotype
                    symbol
                    vep_impact
                    symbol
                    consequences
                    ensembl_gene_id
                    coding_dna_change
                    aa_change
                    strand
                    canonical
                    conservations {
                      phylo_p17way_primate_rankscore
                    }
                    ensembl_transcript_id
                    predictions {
                      fathmm_pred
                      fathmm_converted_rankscore
                      cadd_rankscore
                      dann_rankscore
                      lrt_pred
                      lrt_converted_rankscore
                      revel_rankscore
                      sift_converted_rankscore
                      sift_pred
                      polyphen2_hvar_rankscore
                      polyphen2_hvar_pred
                    }
                    impact_score
                  }
                }
              }
            }
            frequencies {
              internal {
                lower_bound_kf {
                  ac
                  af
                  an
                  homozygotes
                  heterozygotes
                }
                upper_bound_kf {
                  ac
                  af
                  an
                  homozygotes
                  heterozygotes
                }
              }
            }
            studies {
              hits {
                total
              }
            }
            genes {
              hits {
                edges {
                  node {
                    symbol
                    omim_gene_id
                    omim {
                      hits {
                        edges {
                          node {
                            omim_id
                            name
                            inheritance
                          }
                        }
                      }
                    }
                    orphanet {
                      hits {
                        edges {
                          node {
                            panel
                            inheritance
                            disorder_id
                          }
                        }
                      }
                    }
                    cosmic {
                      hits {
                        edges {
                          node {
                            tumour_types_germline
                          }
                        }
                      }
                    }
                    hpo {
                      hits {
                        edges {
                          node {
                            hpo_term_label
                            hpo_term_id
                          }
                        }
                      }
                    }
                    ddd {
                      hits {
                        edges {
                          node {
                            disease_name
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const VARIANT_STATS_QUERY = gql`
  query VariantStats {
    variantStats {
      hits {
        edges {
          node {
            distinctVariantsCount
            occurrencesCount
            participantsCount
            studiesCount
          }
        }
      }
    }
  }
`;

export const VARIANT_AGGREGATION_QUERY = (aggList: string[], mappingResults: MappingResults) => {
  if (!mappingResults || mappingResults.loadingMapping) return gql``;

  const aggListDotNotation = aggList.map((i) => underscoreToDot(i));

  const extendedMappingsFields = aggListDotNotation.flatMap((i) =>
    (mappingResults?.extendedMapping || []).filter((e) => e.field === i),
  );

  return gql`
      query VariantInformation($sqon: JSON) {
        variants {
           aggregations (filters: $sqon, include_missing:false){
            ${generateAggregations(extendedMappingsFields)}
          }
        }
      }
    `;
};

const generateAggregations = (extendedMappingFields: ExtendedMapping[]) => {
  const aggs = extendedMappingFields.map((f) => {
    if (['keyword', 'id'].includes(f.type)) {
      return (
        dotToUnderscore(f.field) + ' {\n     buckets {\n      key\n        doc_count\n    }\n  }'
      );
    } else if (['long', 'float', 'integer', 'date'].includes(f.type)) {
      return dotToUnderscore(f.field) + '{\n    stats {\n  max\n   min\n    }\n    }';
    } else if (['boolean'].includes(f.type)) {
      return (
        dotToUnderscore(f.field) +
        ' {\n      buckets {\n       key\n       doc_count\n     }\n    }'
      );
    } else {
      return '';
    }
  });
  return aggs.join(' ');
};
