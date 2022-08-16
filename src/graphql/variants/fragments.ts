import { gql } from '@apollo/client';

export const genesFragment = gql`
  fragment genesFragment on variantsGenes {
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
                  id
                  score
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
`;

export const frequenciesFragment = gql`
  fragment frequenciesFragment on variantsFrequencies {
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
`;

export const consequencesFragment = gql`
  fragment consequencesFragment on variantsConsequences {
    hits {
      total
      edges {
        node {
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
        }
      }
    }
  }
`;

export const clinvarFragment = gql`
  fragment clinvarFragment on variantsClinvar {
    clin_sig
    clinvar_id
    conditions
    inheritance
    interpretations
  }
`;

export const studiesVariantFragment = gql`
  fragment studiesVariantFragment on variantsStudies {
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
`;
