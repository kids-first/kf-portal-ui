import { Consequence } from 'store/graphql/variants/models';
import { generateConsequencesDataLines } from '../consequences';

const mockConsequencesTranscript: Consequence[] = [
  {
    node: {
      feature_type: 'Transcript',
      biotype: 'antisense',
      symbol: 'ZFY-AS1',
      variant_class: 'SNV',
      conservations: {},
      strand: -1,
      consequences: ['upstream_gene_variant'],
      // @ts-ignore : should be an enum but it's raw data
      vep_impact: 'MODIFIER',
      ensembl_transcript_id: 'ENST00000417305',
      impact_score: 1,
      canonical: true,
      predictions: {},
    },
  },
  {
    node: {
      biotype: 'lincRNA',
      symbol: 'LINC00278',
      conservations: {},
      // @ts-ignore : should be an enum but it's raw data
      vep_impact: 'MODIFIER',
      impact_score: 1,
      canonical: true,
      hgvsc: 'ENST00000444263.5:n.306+2337G>T',
      predictions: {},
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
      conservations: {},
      // @ts-ignore : should be an enum but it's raw data
      vep_impact: 'MODIFIER',
      impact_score: 1,
      canonical: false,
      hgvsc: 'ENST00000425031.1:n.220+2337G>T',
      predictions: {},
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
      conservations: {},
      strand: -1,
      consequences: ['upstream_gene_variant'],
      // @ts-ignore : should be an enum but it's raw data
      vep_impact: 'MODIFIER',
      ensembl_transcript_id: 'ENST00000431145',
      impact_score: 1,
      canonical: false,
      predictions: {},
    },
  },
];

const mockConsequencesInterGenic: Consequence[] = [
  {
    node: {
      variant_class: 'insertion',
      conservations: {},
      consequences: ['intergenic_variant'],
      // @ts-ignore
      vep_impact: 'MODIFIER',
      impact_score: 1,
      canonical: false,
      predictions: {},
    },
  },
];

describe('Consequences', () => {
  it('should create, for a given symbol (gene), one line only for canonical transcript. ', () => {
    expect(generateConsequencesDataLines(mockConsequencesTranscript)).toEqual([
      {
        node: {
          feature_type: 'Transcript',
          biotype: 'antisense',
          symbol: 'ZFY-AS1',
          variant_class: 'SNV',
          conservations: {},
          strand: -1,
          consequences: ['upstream_gene_variant'],
          vep_impact: 'MODIFIER',
          ensembl_transcript_id: 'ENST00000417305',
          impact_score: 1,
          canonical: true,
          predictions: {},
        },
      },
      {
        node: {
          biotype: 'lincRNA',
          symbol: 'LINC00278',
          conservations: {},
          vep_impact: 'MODIFIER',
          impact_score: 1,
          canonical: true,
          hgvsc: 'ENST00000444263.5:n.306+2337G>T',
          predictions: {},
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
    ]);
  });

  it('should generate one line of data when variant is intergenic ', () => {
    expect(generateConsequencesDataLines(mockConsequencesInterGenic)).toEqual([
      {
        node: {
          variant_class: 'insertion',
          conservations: {},
          consequences: ['intergenic_variant'],
          vep_impact: 'MODIFIER',
          impact_score: 1,
          canonical: false,
          predictions: {},
        },
      },
    ]);
  });
});
