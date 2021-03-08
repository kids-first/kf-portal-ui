/* eslint-disable react/display-name */
import React, { FunctionComponent } from 'react';
import { Table, Tooltip } from 'antd';
import style from './VariantTable.module.scss';
import ConsequencesCell from './ConsequencesCell';

const dataSeed = [
  {
    key: '1',
    hgvsg: 'chr18:g.59472573C>T',
    variant_class: 'Insertion',
    rsnumber: 'rs565670580',
    consequences: [
      {
        biotype: 'protein_coding',
        canonical: false,
        consequences: ['Missence', 'intron_variant2'],
        ensembl_transcript_id: 'ENST00000398179',
        feature_type: 'Transcript',
        hgvsc: 'ENST00000398179.3:c.56-2966G>A',
        impact: 'MODIFIER',
        impact_score: 1,
        intron: {
          rank: 1,
          total: 8,
        },
        scores: {
          conservations: {},
          predictions: {},
        },
        strand: -1,
        variant_class: 'SNV',
        symbols: ['VMDF', 'PBOFD'],
      },
      {
        biotype: 'protein_coding',
        canonical: true,
        consequences: ['intron_variant'],
        ensembl_transcript_id: 'ENST00000439986',
        feature_type: 'Transcript',
        hgvsc: 'ENST00000439986.8:c.266-2966G>A',
        impact: 'MODIFIER',
        impact_score: 1,
        intron: {
          rank: 3,
          total: 10,
        },
        scores: {
          conservations: {},
          predictions: {},
        },
        strand: -1,
        variant_class: 'SNV',
        symbols: ['PSFPD', 'EPS'],
      },
      {
        biotype: 'protein_coding',
        canonical: false,
        consequences: ['intron_variant'],
        ensembl_transcript_id: 'ENST00000589419',
        feature_type: 'Transcript',
        hgvsc: 'ENST00000589419.1:c.-308-2966G>A',
        impact: 'MODERATE',
        impact_score: 1,
        intron: {
          rank: 2,
          total: 5,
        },
        scores: {
          conservations: {},
          predictions: {},
        },
        strand: -1,
        variant_class: 'SNV',
        symbols: ['EUUD', 'OSDFO'],
      },
    ],
    clinvar: { clin_sig: 'Benign' },
    studies: [
      {
        acls: ['SD_BHJXBDQK.c1'],
        external_study_ids: ['SD_BHJXBDQK'],
        frequencies: {
          gru: {
            ac: 1,
            af: 0.5,
            an: 2,
            heterozygotes: 1,
            homozygotes: 0,
          },
          hmb: {
            ac: 0,
            af: 0.0,
            an: 0,
            heterozygotes: 0,
            homozygotes: 0,
          },
        },
        participant_number: 1,
        study_id: 'SD_BHJXBDQK',
      },
      {
        acls: ['phs001110.c1'],
        external_study_ids: ['phs001110'],
        frequencies: {
          gru: {
            ac: 2,
            af: 0.5,
            an: 4,
            heterozygotes: 2,
            homozygotes: 0,
          },
          hmb: {
            ac: 0,
            af: 0.0,
            an: 0,
            heterozygotes: 0,
            homozygotes: 0,
          },
        },
        participant_number: 2,
        study_id: 'SD_46SK55A3',
      },
    ],
    participant_number: '3',
    frequencies: {
      '1k_genomes': {},
      gnomad_exomes_2_1: {},
      gnomad_genomes_2_1: {},
      gnomad_genomes_3_0: {},
      internal: {
        combined: {
          ac: 1,
          af: 0.5,
          an: 2,
          heterozygotes: 1,
          homozygotes: 0,
        },
        gru: {
          ac: 1,
          af: 0.5,
          an: 2,
          heterozygotes: 1,
          homozygotes: 0,
        },
        hmb: {
          ac: 0,
          af: 0.0,
          an: 0,
          heterozygotes: 0,
          homozygotes: 0,
        },
      },
      topmed: {},
    },
  },
  {
    key: '2',
    hgvsg: 'chr18:g.49126GCTGGCCTCGTGGTGG',
    variant_class: 'Insertion',
    rsnumber: 'rs565670580',
    consequences: [
      {
        biotype: 'protein_coding',
        canonical: false,
        consequences: ['intron_variant'],
        ensembl_transcript_id: 'ENST00000398179',
        feature_type: 'Transcript',
        hgvsc: 'ENST00000398179.3:c.56-2966G>A',
        impact: 'MODIFIER',
        impact_score: 1,
        intron: {
          rank: 1,
          total: 8,
        },
        scores: {
          conservations: {},
          predictions: {},
        },
        strand: -1,
        variant_class: 'SNV',
      },
      {
        biotype: 'protein_coding',
        canonical: true,
        consequences: ['intron_variant'],
        ensembl_transcript_id: 'ENST00000439986',
        feature_type: 'Transcript',
        hgvsc: 'ENST00000439986.8:c.266-2966G>A',
        impact: 'LOW',
        impact_score: 1,
        intron: {
          rank: 3,
          total: 10,
        },
        scores: {
          conservations: {},
          predictions: {},
        },
        strand: -1,
        variant_class: 'SNV',
        ymbols: ['LSDF', 'IER'],
      },
      {
        biotype: 'protein_coding',
        canonical: false,
        consequences: ['intron_variant'],
        ensembl_transcript_id: 'ENST00000589419',
        feature_type: 'Transcript',
        hgvsc: 'ENST00000589419.1:c.-308-2966G>A',
        impact: 'HIGH',
        impact_score: 1,
        intron: {
          rank: 2,
          total: 5,
        },
        scores: {
          conservations: {},
          predictions: {},
        },
        strand: -1,
        variant_class: 'SNV',
      },
    ],
    clinvar: { clin_sig: 'test' },
    studies: [
      {
        acls: ['SD_BHJXBDQK.c1'],
        external_study_ids: ['SD_BHJXBDQK'],
        frequencies: {
          gru: {
            ac: 1,
            af: 0.5,
            an: 2,
            heterozygotes: 1,
            homozygotes: 0,
          },
          hmb: {
            ac: 0,
            af: 0.0,
            an: 0,
            heterozygotes: 0,
            homozygotes: 0,
          },
        },
        participant_number: 1,
        study_id: 'SD_BHJXBDQK',
      },
      {
        acls: ['phs001110.c1'],
        external_study_ids: ['phs001110'],
        frequencies: {
          gru: {
            ac: 2,
            af: 0.5,
            an: 4,
            heterozygotes: 2,
            homozygotes: 0,
          },
          hmb: {
            ac: 0,
            af: 0.0,
            an: 0,
            heterozygotes: 0,
            homozygotes: 0,
          },
        },
        participant_number: 2,
        study_id: 'SD_46SK55A3',
      },
    ],
    participant_number: '3',
    frequencies: {
      '1k_genomes': {},
      gnomad_exomes_2_1: {},
      gnomad_genomes_2_1: {},
      gnomad_genomes_3_0: {
        ac: 33,
        af: 3.804034582132565e-4,
        an: 86750,
        homozygotes: 1,
      },
      internal: {
        combined: {
          ac: 1,
          af: 0.5,
          an: 2,
          heterozygotes: 1,
          homozygotes: 0,
        },
        gru: {
          ac: 1,
          af: 0.5,
          an: 2,
          heterozygotes: 1,
          homozygotes: 0,
        },
        hmb: {
          ac: 0,
          af: 0.0,
          an: 0,
          heterozygotes: 0,
          homozygotes: 0,
        },
      },
      topmed: {},
    },
  },
];

const dataSource = [...dataSeed].map((n: any) => ({
  ...n,
  key: Number.parseInt(n.key) + 1,
}));

//TODO remove hardcoded values, typing - make it global.

const columns = [
  {
    title: 'Variant',
    dataIndex: 'hgvsg',
    key: 'hgvsg',
    sorter: true,
    ellipsis: true,
    width: '10%',
    render: (variant: string) =>
      variant ? (
        <Tooltip placement="topLeft" title={variant} color={'#2b388f'}>
          <a href="test" target="_blank" rel="noopener noreferrer">
            {variant}
          </a>
        </Tooltip>
      ) : (
        ''
      ),
  },
  {
    title: 'Type',
    dataIndex: 'variant_class',
    key: 'variant_class',
  },
  {
    title: 'dbSnp',
    dataIndex: 'rsnumber',
    key: 'rsnumber',
    render: (rsNumber: string) =>
      rsNumber ? (
        <a href={`https://www.ncbi.nlm.nih.gov/snp/${rsNumber}`} target="_blank" rel="noreferrer">
          {rsNumber}
        </a>
      ) : (
        ''
      ),
  },
  {
    title: 'Consequences',
    dataIndex: 'consequences',
    key: 'consequences',
    width: '20%',
    render: (consequences: any[]) => <ConsequencesCell consequences={consequences} />,
  },
  {
    title: 'CLINVAR',
    dataIndex: 'clinvar',
    key: 'clinvar',
    render: (clinVar: { [key: string]: any }) =>
      clinVar?.clin_sig ? (
        <a
          href={`https://www.ncbi.nlm.nih.gov/clinvar/variation/${clinVar.clin_sig}`}
          target="_blank"
          rel="noreferrer"
        >
          {clinVar.clin_sig}
        </a>
      ) : (
        ''
      ),
    sorter: true,
  },
  {
    title: '# Studies',
    dataIndex: 'studies',
    key: 'studies',
    render: (studies: { [key: string]: any }) => (studies || []).length,
  },
  {
    title: 'Participant',
    dataIndex: 'participant_number',
    key: 'participant_number',
  },
  {
    title: 'ALT Allele',
    dataIndex: 'frequencies',
    key: 'alt',
    render: (frequencies: { [key: string]: any }) => frequencies?.internal?.combined?.ac,
  },
  {
    title: 'Total Allele',
    dataIndex: 'frequencies',
    key: 'total_allele',
    render: (frequencies: { [key: string]: any }) => frequencies?.internal?.combined?.an,
  },
  {
    title: 'Allele Freq.',
    dataIndex: 'frequencies',
    key: 'freq_allele',
    render: (frequencies: { [key: string]: any }) => frequencies?.internal?.combined?.af,
  },
  {
    title: 'Homozygote',
    dataIndex: 'frequencies',
    key: 'homozygote',
    render: (frequencies: { [key: string]: any }) => frequencies?.internal?.combined?.homozygotes,
  },
];

const isEven = (n: number) => n % 2 === 0;

const VariantTable: FunctionComponent = () => (
  <Table
    bordered
    dataSource={dataSource}
    columns={columns}
    className={style.table}
    rowClassName={(_, index) => (isEven(index) ? '' : style.rowOdd)}
  />
);

export default VariantTable;
