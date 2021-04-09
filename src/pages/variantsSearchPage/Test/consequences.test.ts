import { Consequence } from 'store/graphql/variants/models';
import { generateConsequencesDataLines } from '../consequences';

const mockConsequencesTranscript: Consequence[] = [
  {
    node: {
      feature_type: 'Transcript',
      biotype: 'antisense',
      symbol: 'ZFY-AS1',
      variant_class: 'SNV',
      conservations: {
        phylo_p17way_primate_rankscore: null,
      },
      strand: -1,
      consequences: ['upstream_gene_variant'],
      // @ts-ignore : should be an enum but it's raw data
      vep_impact: 'MODIFIER',
      ensembl_transcript_id: 'ENST00000417305',
      impact_score: 1,
      canonical: true,
      predictions: {
        fathmm_pred: null,
        fathmm_converted_rankscore: null,
        cadd_rankscore: null,
        dann_score: null,
        dann_rankscore: null,
        lrt_pred: null,
        lrt_converted_rankscore: null,
        revel_rankscore: null,
        sift_converted_rankscore: null,
        sift_pred: null,
        polyphen2_hvar_score: null,
        polyphen2_hvar_pred: null,
        polyphen2_hvar_rankscore: null,
      },
    },
  },
  {
    node: {
      biotype: 'lincRNA',
      symbol: 'LINC00278',
      conservations: {
        phylo_p17way_primate_rankscore: null,
      },
      // @ts-ignore : should be an enum but it's raw data
      vep_impact: 'MODIFIER',
      impact_score: 1,
      canonical: true,
      hgvsc: 'ENST00000444263.5:n.306+2337G>T',
      predictions: {
        fathmm_pred: null,
        fathmm_converted_rankscore: null,
        cadd_rankscore: null,
        dann_score: null,
        dann_rankscore: null,
        lrt_pred: null,
        lrt_converted_rankscore: null,
        revel_rankscore: null,
        sift_converted_rankscore: null,
        sift_pred: null,
        polyphen2_hvar_score: null,
        polyphen2_hvar_pred: null,
        polyphen2_hvar_rankscore: null,
      },
      feature_type: 'Transcript',
      variant_class: 'SNV',
      strand: 1,
      intron: {
        total: 2,
        rank: 1,
      },
      consequences: ['intron_variant', 'non_coding_transcript_variant'],
      ensembl_transcript_id: 'ENST00000444263',
    },
  },
  {
    node: {
      biotype: 'lincRNA',
      symbol: 'LINC00278',
      conservations: {
        phylo_p17way_primate_rankscore: null,
      },
      // @ts-ignore : should be an enum but it's raw data
      vep_impact: 'MODIFIER',
      impact_score: 1,
      canonical: false,
      hgvsc: 'ENST00000425031.1:n.220+2337G>T',
      predictions: {
        fathmm_pred: null,
        fathmm_converted_rankscore: null,
        cadd_rankscore: null,
        dann_score: null,
        dann_rankscore: null,
        lrt_pred: null,
        lrt_converted_rankscore: null,
        revel_rankscore: null,
        sift_converted_rankscore: null,
        sift_pred: null,
        polyphen2_hvar_score: null,
        polyphen2_hvar_pred: null,
        polyphen2_hvar_rankscore: null,
      },
      feature_type: 'Transcript',
      variant_class: 'SNV',
      strand: 1,
      intron: {
        total: 3,
        rank: 1,
      },
      consequences: ['intron_variant', 'non_coding_transcript_variant'],
      ensembl_transcript_id: 'ENST00000425031',
    },
  },
  {
    node: {
      feature_type: 'Transcript',
      biotype: 'antisense',
      symbol: 'ZFY-AS1',
      variant_class: 'SNV',
      conservations: {
        phylo_p17way_primate_rankscore: null,
      },
      strand: -1,
      consequences: ['upstream_gene_variant'],
      // @ts-ignore : should be an enum but it's raw data
      vep_impact: 'MODIFIER',
      ensembl_transcript_id: 'ENST00000431145',
      impact_score: 1,
      canonical: false,
      predictions: {
        fathmm_pred: null,
        fathmm_converted_rankscore: null,
        cadd_rankscore: null,
        dann_score: null,
        dann_rankscore: null,
        lrt_pred: null,
        lrt_converted_rankscore: null,
        revel_rankscore: null,
        sift_converted_rankscore: null,
        sift_pred: null,
        polyphen2_hvar_score: null,
        polyphen2_hvar_pred: null,
        polyphen2_hvar_rankscore: null,
      },
    },
  },
];

const mockConsequencesInterGenic: Consequence[] = [
  {
    node: {
      variant_class: 'insertion',
      conservations: {
        phylo_p17way_primate_rankscore: null,
      },
      consequences: ['intergenic_variant'],
      // @ts-ignore
      vep_impact: 'MODIFIER',
      impact_score: 1,
      canonical: false,
      predictions: {
        fathmm_pred: null,
        fathmm_converted_rankscore: null,
        cadd_rankscore: null,
        dann_score: null,
        dann_rankscore: null,
        lrt_pred: null,
        lrt_converted_rankscore: null,
        revel_rankscore: null,
        sift_converted_rankscore: null,
        sift_pred: null,
        polyphen2_hvar_score: null,
        polyphen2_hvar_pred: null,
        polyphen2_hvar_rankscore: null,
      },
    },
  },
];

const mockConsequences1InterGenicAnd1Symbol: Consequence[] = [
  {
    node: {
      variant_class: 'insertion',
      conservations: {
        phylo_p17way_primate_rankscore: null,
      },
      consequences: ['intergenic_variant'],
      // @ts-ignore
      vep_impact: 'MODIFIER',
      impact_score: 1,
      canonical: false,
      predictions: {
        fathmm_pred: null,
        fathmm_converted_rankscore: null,
        cadd_rankscore: null,
        dann_score: null,
        dann_rankscore: null,
        lrt_pred: null,
        lrt_converted_rankscore: null,
        revel_rankscore: null,
        sift_converted_rankscore: null,
        sift_pred: null,
        polyphen2_hvar_score: null,
        polyphen2_hvar_pred: null,
        polyphen2_hvar_rankscore: null,
      },
    },
  },
  {
    node: {
      symbol: 'TTTY1',
      // @ts-ignore
      vep_impact: 'MODIFIER',
      consequences: ['intron_variant', 'non_coding_transcript_variant'],
      aa_change: null,
      impact_score: 1,
    },
  },
];

const mockConsequences1SymboleManyImpactsNoCanonical: Consequence[] = [
  {
    node: {
      symbol: 'TTTY1',
      // @ts-ignore
      vep_impact: 'MODIFIER',
      consequences: ['intron_variant', 'non_coding_transcript_variant'],
      aa_change: null,
      impact_score: null,
    },
  },
  {
    node: {
      symbol: 'TTTY1',
      // @ts-ignore
      vep_impact: 'MODIFIER',
      consequences: ['intron_variant', 'non_coding_transcript_variant'],
      aa_change: null,
      impact_score: 2,
    },
  },
  {
    node: {
      symbol: 'TTTY1',
      // @ts-ignore
      vep_impact: 'MODIFIER',
      consequences: ['intron_variant', 'non_coding_transcript_variant'],
      aa_change: null,
      impact_score: 1,
    },
  },
];

describe('Consequences', () => {
  it('should create, for a given symbol (gene), one line only for canonical transcript. ', () => {
    expect(generateConsequencesDataLines(mockConsequencesTranscript)).toEqual([
      {
        node: {
          biotype: 'antisense',
          canonical: true,
          consequences: ['upstream_gene_variant'],
          conservations: {
            phylo_p17way_primate_rankscore: null,
          },
          ensembl_transcript_id: 'ENST00000417305',
          feature_type: 'Transcript',
          impact_score: 1,
          predictions: {
            cadd_rankscore: null,
            dann_rankscore: null,
            dann_score: null,
            fathmm_converted_rankscore: null,
            fathmm_pred: null,
            lrt_converted_rankscore: null,
            lrt_pred: null,
            polyphen2_hvar_pred: null,
            polyphen2_hvar_rankscore: null,
            polyphen2_hvar_score: null,
            revel_rankscore: null,
            sift_converted_rankscore: null,
            sift_pred: null,
          },
          strand: -1,
          symbol: 'ZFY-AS1',
          variant_class: 'SNV',
          vep_impact: 'MODIFIER',
        },
      },
      {
        node: {
          biotype: 'lincRNA',
          canonical: true,
          consequences: ['intron_variant', 'non_coding_transcript_variant'],
          conservations: {
            phylo_p17way_primate_rankscore: null,
          },
          ensembl_transcript_id: 'ENST00000444263',
          feature_type: 'Transcript',
          hgvsc: 'ENST00000444263.5:n.306+2337G>T',
          impact_score: 1,
          intron: {
            rank: 1,
            total: 2,
          },
          predictions: {
            cadd_rankscore: null,
            dann_rankscore: null,
            dann_score: null,
            fathmm_converted_rankscore: null,
            fathmm_pred: null,
            lrt_converted_rankscore: null,
            lrt_pred: null,
            polyphen2_hvar_pred: null,
            polyphen2_hvar_rankscore: null,
            polyphen2_hvar_score: null,
            revel_rankscore: null,
            sift_converted_rankscore: null,
            sift_pred: null,
          },
          strand: 1,
          symbol: 'LINC00278',
          variant_class: 'SNV',
          vep_impact: 'MODIFIER',
        },
      },
    ]);
  });

  it('should generate one line of data when variant is intergenic ', () => {
    expect(generateConsequencesDataLines(mockConsequencesInterGenic)).toEqual([
      {
        node: {
          canonical: false,
          consequences: ['intergenic_variant'],
          conservations: {
            phylo_p17way_primate_rankscore: null,
          },
          impact_score: 1,
          predictions: {
            cadd_rankscore: null,
            dann_rankscore: null,
            dann_score: null,
            fathmm_converted_rankscore: null,
            fathmm_pred: null,
            lrt_converted_rankscore: null,
            lrt_pred: null,
            polyphen2_hvar_pred: null,
            polyphen2_hvar_rankscore: null,
            polyphen2_hvar_score: null,
            revel_rankscore: null,
            sift_converted_rankscore: null,
            sift_pred: null,
          },
          variant_class: 'insertion',
          vep_impact: 'MODIFIER',
        },
      },
    ]);
  });

  it('should generate one line of data for intergenic and one line for symbol', () => {
    expect(generateConsequencesDataLines(mockConsequences1InterGenicAnd1Symbol)).toEqual([
      {
        node: {
          canonical: false,
          consequences: ['intergenic_variant'],
          conservations: {
            phylo_p17way_primate_rankscore: null,
          },
          impact_score: 1,
          predictions: {
            cadd_rankscore: null,
            dann_rankscore: null,
            dann_score: null,
            fathmm_converted_rankscore: null,
            fathmm_pred: null,
            lrt_converted_rankscore: null,
            lrt_pred: null,
            polyphen2_hvar_pred: null,
            polyphen2_hvar_rankscore: null,
            polyphen2_hvar_score: null,
            revel_rankscore: null,
            sift_converted_rankscore: null,
            sift_pred: null,
          },
          variant_class: 'insertion',
          vep_impact: 'MODIFIER',
        },
      },
      {
        node: {
          aa_change: null,
          consequences: ['intron_variant', 'non_coding_transcript_variant'],
          impact_score: 1,
          symbol: 'TTTY1',
          vep_impact: 'MODIFIER',
        },
      },
    ]);
  });

  it('should generate one line of data for highest impact score (no canonical)', () => {
    expect(generateConsequencesDataLines(mockConsequences1SymboleManyImpactsNoCanonical)).toEqual([
      {
        node: {
          symbol: 'TTTY1',
          // @ts-ignore
          vep_impact: 'MODIFIER',
          consequences: ['intron_variant', 'non_coding_transcript_variant'],
          aa_change: null,
          impact_score: 2,
        },
      },
    ]);
  });
});
