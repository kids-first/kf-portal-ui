import { IVariantEntity as IVariantEntityFerlab } from '@ferlab/ui/core/pages/EntityPage/type';

export const variantDataMock: IVariantEntityFerlab = {
  id: 'T_K63HwB7ARyLJRSUgGt',
  alternate: 'G',
  chromosome: '10',
  genome_build: 'GRCh38',
  hgvsg: 'chr10:g.123137309del',
  locus: '10-123137306-GA-G',
  participant_number: 1,
  participant_total_number: 11030,
  reference: 'GA',
  rsnumber: '',
  start: 123137306,
  variant_class: 'deletion',
  studies: {
    hits: {
      total: 1,
      edges: [
        {
          node: {
            id: 'test',
            participant_ids: [],
            participant_number: 1,
            study_id: 'SD_DYPMEHHF',
            study_code: 'KF-NBL',
            frequencies: {
              upper_bound_kf: {
                ac: 1,
                homozygotes: 0,
              },
            },
          },
        },
      ],
    },
  },
  consequences: {
    hits: {
      total: 1,
      edges: [
        {
          node: {
            symbol: 'HMX3',
            biotype: 'protein_coding',
            consequences: ['frameshift_variant'],
            //@ts-ignore type is wrong, value is valie from BE
            vep_impact: 'HIGH',
            impact_score: 4,
            canonical: true,
            strand: '',
            refseq_mrna_id: 'NM_001105574',
            ensembl_transcript_id: 'ENST00000357878',
            ensembl_gene_id: 'ENSG00000188620',
            hgvsc: 'ENST00000357878.5:c.652del',
            hgvsp: 'ENSP00000350549.4:p.Ser218ValfsTer31',
            predictions: {
              fathmm_pred: 0,
              lrt_pred: '',
              lrt_converted_rankscore: 0,
              revel_rankscore: 0,
              sift_pred: '',
              polyphen2_hvar_pred: '',
              sift_converted_rankscore: 0,
              cadd_rankscore: 0,
              dann_rankscore: 0,
              fathmm_converted_rankscore: 0,
              polyphen2_hvar_rankscore: 0,
            },
            conservations: {
              phylo_p17way_primate_rankscore: 0,
            },
          },
        },
      ],
    },
  },
  //@ts-ignore
  clinvar: '',
  frequencies: {
    internal: {
      upper_bound_kf: {
        ac: 1,
        homozygotes: 0,
      },
    },
    topmed: {
      ac: 0,
      af: 0,
      an: 0,
      homozygotes: 0,
    },
    one_thousand_genomes: {
      ac: 0,
      af: 0,
      an: 0,
      homozygotes: 0,
    },
    gnomad_exomes_2_1: {
      ac: 0,
      af: 0,
      an: 0,
      homozygotes: 0,
    },
    gnomad_genomes_2_1: {
      ac: 0,
      af: 0,
      an: 0,
      homozygotes: 0,
    },
    gnomad_genomes_3_0: {
      ac: 0,
      af: 0,
      an: 0,
      homozygotes: 0,
    },
    gnomad_genomes_3_1_1: {
      ac: 0,
      af: 0,
      an: 0,
      homozygotes: 0,
    },
  },
  genes: {
    hits: {
      total: 1,
      edges: [
        {
          node: {
            location: '10q26.13',
            omim_gene_id: '613380',
            symbol: 'HMX3',
            cosmic: {
              hits: {
                total: 0,
                edges: [],
              },
            },
            ddd: {
              hits: {
                total: 0,
                edges: [],
              },
            },
            hpo: {
              hits: {
                total: 0,
                edges: [],
              },
            },
            omim: {
              hits: {
                total: 0,
                edges: [],
              },
            },
            orphanet: {
              hits: {
                total: 0,
                edges: [],
              },
            },
            id: undefined,
          },
        },
      ],
    },
  },
};
