import { gql } from '@apollo/client';

export const SEARCH_VARIANT_QUERY = gql`
  query searchVariant($sqon: JSON, $first: Int, $offset: Int, $sort: [Sort], $searchAfter: JSON) {
    variants {
      hits(filters: $sqon, first: $first, offset: $offset, sort: $sort, searchAfter: $searchAfter) {
        total
        edges {
          searchAfter
          node {
            id
            variant_id: id
            score
            alternate
            chromosome
            genome_build
            hash
            hgvsg
            locus
            max_impact_score
            participant_frequency
            participant_number
            participant_number_visible
            participant_total_number
            reference
            release_id
            rsnumber
            start
            variant_class
            acls
            gene_external_reference
            external_study_ids
            variant_external_reference
            vep_impacts
            zygosity
            transmissions
            clinvar {
              clin_sig
              clinvar_id
              conditions
              inheritance
              interpretations
            }
            studies {
              hits {
                total
                edges {
                  node {
                    score
                    participant_ids
                    participant_number
                    study_code
                    study_id
                    acls
                    external_study_ids
                    transmissions
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
                  }
                }
              }
            }
            genes {
              hits {
                total
                edges {
                  node {
                    score
                    ensembl_gene_id
                    entrez_gene_id
                    hgnc
                    location
                    name
                    omim_gene_id
                    symbol
                    alias

                    cosmic {
                      hits {
                        total
                        edges {
                          node {
                            id
                            score
                            tumour_types_germline
                          }
                        }
                      }
                    }
                    ddd {
                      hits {
                        total
                        edges {
                          node {
                            #id
                            #score
                            disease_name
                          }
                        }
                      }
                    }
                    hpo {
                      hits {
                        total
                        edges {
                          node {
                            score
                            hpo_term_id
                            hpo_term_label
                            hpo_term_name
                          }
                        }
                      }
                    }
                    omim {
                      hits {
                        total
                        edges {
                          node {
                            score
                            inheritance
                            inheritance_code
                            name
                            omim_id
                          }
                        }
                      }
                    }
                    orphanet {
                      hits {
                        total
                        edges {
                          node {
                            score
                            inheritance
                            disorder_id
                            panel
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            frequencies {
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
              gnomad_genomes_3_1_1 {
                ac
                af
                an
              }
              one_thousand_genomes {
                ac
                af
                an
              }
              topmed {
                ac
                af
                an
                homozygotes
                heterozygotes
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
            consequences {
              hits {
                total
                edges {
                  node {
                    impact_score
                    canonical
                    predictions {
                      fathmm_pred
                      lrt_pred
                      lrt_converted_rankscore
                      revel_rankscore
                      sift_pred
                      polyphen2_hvar_pred
                      polyphen2_hvar_rankscore
                      sift_converted_rankscore
                      cadd_rankscore
                      dann_rankscore
                      fathmm_converted_rankscore
                    }
                    hgvsc
                    consequences
                    vep_impact
                    symbol
                    aa_change
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

export const GET_VARIANT_COUNT = gql`
  query getVariantsCount($sqon: JSON) {
    variants {
      hits(filters: $sqon) {
        total
      }
    }
  }
`;
