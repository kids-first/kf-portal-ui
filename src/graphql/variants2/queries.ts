import { gql } from '@apollo/client';

export const SEARCH_VARIANT_QUERY = gql`
  query searchVariant($sqon: JSON, $first: Int, $offset: Int, $sort: [Sort], $searchAfter: JSON) {
    variants: variants2 {
      hits(filters: $sqon, first: $first, offset: $offset, sort: $sort, searchAfter: $searchAfter) {
        total
        edges {
          searchAfter
          node {
            alternate
            assembly_version
            chromosome
            clinvar {
              clin_sig
              clinvar_id
              conditions
              inheritance
              interpretations
            }
            dna_change
            end
            external_frequencies {
              topmed_bravo {
                ac
                af
                an
                hom
                het
              }
              gnomad_exomes_2_1_1 {
                ac
                af
                an
                hom
              }
              gnomad_genomes_2_1_1 {
                ac
                af
                an
                hom
              }
              gnomad_genomes_3 {
                ac
                af
                an
                hom
              }
              thousand_genomes {
                ac
                af
                an
              }
            }
            gene_external_reference
            genes {
              hits {
                total
                edges {
                  node {
                    alias
                    biotype
                    consequences {
                      hits {
                        total
                        edges {
                          node {
                            aa_change
                            amino_acids {
                              reference
                              variant
                            }
                            canonical
                            cdna_position
                            cds_position
                            coding_dna_change
                            codons {
                              reference
                              variant
                            }
                            consequence
                            conservations {
                              phyloP100way_vertebrate
                              phyloP17way_primate
                            }
                            ensembl_feature_id
                            ensembl_transcript_id
                            exon {
                              rank
                              total
                            }
                            feature_type
                            hgvsc
                            hgvsp
                            impact_score
                            intron {
                              rank
                              total
                            }
                            mane_plus
                            mane_select
                            picked
                            predictions {
                              cadd_phred
                              cadd_score
                              dann_score
                              fathmm_pred
                              fathmm_score
                              lrt_pred
                              lrt_score
                              polyphen2_hvar_pred
                              polyphen2_hvar_score
                              revel_score
                              sift_pred
                              sift_score
                            }
                            protein_position
                            refseq_mrna_id
                            strand
                            uniprot_id
                            vep_impact
                          }
                        }
                      }
                    }
                    cosmic {
                      hits {
                        total
                        edges {
                          node {
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
                            disease_name
                          }
                        }
                      }
                    }
                    ensembl_gene_id
                    entrez_gene_id
                    gnomad {
                      loeuf
                      pli
                    }
                    hgnc
                    hpo {
                      hits {
                        total
                        edges {
                          node {
                            hpo_term_id
                            hpo_term_label
                            hpo_term_name
                          }
                        }
                      }
                    }
                    location
                    name
                    omim {
                      hits {
                        total
                        edges {
                          node {
                            inheritance
                            inheritance_code
                            name
                            omim_id
                          }
                        }
                      }
                    }
                    omim_gene_id
                    orphanet {
                      hits {
                        total
                        edges {
                          node {
                            disorder_id
                            panel
                            inheritance
                          }
                        }
                      }
                    }
                    symbol
                  }
                }
              }
            }
            hash
            hgvsg
            id
            internal_frequencies {
              total {
                ac
                pc
                hom
                pn
                an
                af
                pf
              }
            }
            locus
            max_impact_score
            reference
            rsnumber
            start
            studies {
              hits {
                total
                edges {
                  node {
                    score
                    study_code
                    study_id
                    total {
                      ac
                      pc
                      hom
                      pn
                      an
                      af
                      pf
                    }
                    transmission
                    participant_ids
                    zygosity
                  }
                }
              }
            }
            variant_class
            variant_id: id
          }
        }
      }
    }
  }
`;

export const GET_VARIANT_ENTITY = gql`
  query getVariantEntity($sqon: JSON) {
    variants: variants2 {
      hits(filters: $sqon) {
        edges {
          node {
            alternate
            assembly_version
            chromosome
            clinvar {
              clin_sig
              clinvar_id
              conditions
              inheritance
              interpretations
            }
            dna_change
            end
            external_frequencies {
              topmed_bravo {
                ac
                af
                an
                hom
                het
              }
              gnomad_exomes_2_1_1 {
                ac
                af
                an
                hom
              }
              gnomad_genomes_2_1_1 {
                ac
                af
                an
                hom
              }
              gnomad_genomes_3 {
                ac
                af
                an
                hom
              }
              thousand_genomes {
                ac
                af
                an
              }
            }
            gene_external_reference
            genes {
              hits {
                total
                edges {
                  node {
                    alias
                    biotype
                    consequences {
                      hits {
                        total
                        edges {
                          node {
                            aa_change
                            amino_acids {
                              reference
                              variant
                            }
                            canonical
                            cdna_position
                            cds_position
                            coding_dna_change
                            codons {
                              reference
                              variant
                            }
                            consequence
                            conservations {
                              phyloP100way_vertebrate
                              phyloP17way_primate
                            }
                            ensembl_feature_id
                            ensembl_transcript_id
                            exon {
                              rank
                              total
                            }
                            feature_type
                            hgvsc
                            hgvsp
                            impact_score
                            intron {
                              rank
                              total
                            }
                            mane_plus
                            mane_select
                            picked
                            predictions {
                              cadd_phred
                              cadd_score
                              dann_score
                              fathmm_pred
                              fathmm_score
                              lrt_pred
                              lrt_score
                              polyphen2_hvar_pred
                              polyphen2_hvar_score
                              revel_score
                              sift_pred
                              sift_score
                            }
                            protein_position
                            refseq_mrna_id
                            strand
                            uniprot_id
                            vep_impact
                          }
                        }
                      }
                    }
                    cosmic {
                      hits {
                        total
                        edges {
                          node {
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
                            disease_name
                          }
                        }
                      }
                    }
                    ensembl_gene_id
                    entrez_gene_id
                    gnomad {
                      loeuf
                      pli
                    }
                    hgnc
                    hpo {
                      hits {
                        total
                        edges {
                          node {
                            hpo_term_id
                            hpo_term_label
                            hpo_term_name
                          }
                        }
                      }
                    }
                    location
                    name
                    omim {
                      hits {
                        total
                        edges {
                          node {
                            inheritance
                            inheritance_code
                            name
                            omim_id
                          }
                        }
                      }
                    }
                    omim_gene_id
                    orphanet {
                      hits {
                        total
                        edges {
                          node {
                            disorder_id
                            panel
                            inheritance
                          }
                        }
                      }
                    }
                    spliceai {
                      ds
                      type
                    }
                    symbol
                  }
                }
              }
            }
            hash
            hgvsg
            id
            internal_frequencies {
              total {
                ac
                pc
                hom
                pn
                an
                af
                pf
              }
            }
            locus
            max_impact_score
            reference
            rsnumber
            start
            studies {
              hits {
                total
                edges {
                  node {
                    score
                    study_code
                    study_id
                    total {
                      ac
                      pc
                      hom
                      pn
                      an
                      af
                      pf
                    }
                    transmission
                    zygosity
                    participant_ids
                  }
                }
              }
            }
            variant_class
            variant_id: id
          }
        }
      }
    }
  }
`;

export const GET_VARIANT_COUNT = gql`
  query getVariantsCount($sqon: JSON) {
    variants: variants2 {
      hits(filters: $sqon) {
        total
      }
    }
  }
`;
