import React, { ReactElement } from 'react';
import { Impact, IVariantEntity } from '@ferlab/ui/core/pages//EntityPage/type';
import { render } from '@testing-library/react';

import { getSummaryItems } from '../summary';

describe('VariantEntity summary', () => {
  const getArrangerResultTree = (obj: any) => ({
    hits: {
      total: 1,
      edges: [{ node: obj }],
    },
  });
  let boundTypeMock;
  let freqTopmedMock;
  let mockedEntity: IVariantEntity | undefined;
  const genes = {
    id: 'test',
    location: 'test',
    omim_gene_id: 'test',
    symbol: 'test',
    cosmic: {
      id: 'test',
      tumour_types_germline: ['test'],
    },
    ddd: {
      id: 'test',
      disease_name: 'test',
    },
    hpo: {
      id: 'test',
      hpo_term_label: 'test',
      hpo_term_id: 'test',
    },
    omim: {
      id: 'test',
      omim_id: 'test',
      name: 'test',
      inheritance: null,
    },
    orphanet: {
      id: 'test',
      panel: 'test',
      inheritance: undefined,
      disorder_id: 12,
    },
  };

  beforeAll(() => {
    boundTypeMock = {
      ac: 12,
      homozygotes: 12,
    };

    freqTopmedMock = {
      ac: 12,
      af: 12,
      an: 12,
      homozygotes: 12,
    };

    mockedEntity = {
      id: 'test',
      alternate: 'test',
      chromosome: 'test',
      genome_build: 'test',
      hgvsg: 'test',
      locus: 'test',
      participant_number: 12,
      participant_total_number: 12,
      reference: 'test',
      rsnumber: 'test',
      start: 1,
      variant_class: 'test',
      studies: getArrangerResultTree({
        id: 'test',
        participant_ids: ['test'],
        participant_number: 12,
        study_id: '23',
        frequencies: {
          upper_bound_kf_af: boundTypeMock,
        },
      }),
      consequences: getArrangerResultTree({
        id: 'test',
        symbol: 'test',
        consequences: ['test'],
        vep_impact: Impact.Moderate,
        impact_score: null,
        canonical: true,
        strand: 'test',
        refseq_mrna_id: 'test',
        ensembl_transcript_id: 'test',
        ensembl_gene_id: 'test',
        predictions: {
          fathmm_pred: 12,
          lrt_pred: 'test',
          lrt_converted_rankscore: 12,
          revel_rankscore: 12,
          sift_pred: 'test',
          polyphen2_hvar_pred: 'test',
          sift_converted_rankscore: 12,
          cadd_rankscore: 12,
          dann_rankscore: 12,
          fathmm_converted_rankscore: 12,
        },
        conservations: {
          phylo_p17way_primate_rankscore: 12,
        },
        biotype: 'test',
        hgvsc: 'test',
        hgvsp: 'test',
      }),
      clinvar: {
        clinvar_id: undefined,
        inheritance: ['test'],
        conditions: ['test'],
        clin_sig: ['test'],
      },
      frequencies: {
        internal: {
          upper_bound_kf: boundTypeMock,
        },
        topmed: freqTopmedMock,
        one_thousand_genomes: freqTopmedMock,
        gnomad_exomes_2_1: freqTopmedMock,
        gnomad_genomes_2_1: freqTopmedMock,
        gnomad_genomes_3_0: freqTopmedMock,
        gnomad_genomes_3_1_1: freqTopmedMock,
      },
      genes: getArrangerResultTree(genes),
    };
  });

  test('onim correctly display when there is a value', () => {
    const result = getSummaryItems(mockedEntity);
    expect(result).toBeTruthy();
    expect(result[0].rows[0].data[0].value).toEqual('test');
    const { getByText } = render((result[0].rows[0].data[5].value as ReactElement) || <div />);

    expect(getByText('test')).toBeTruthy();
  });

  test('onim correctly display when there is no value', () => {
    const genes2 = genes;
    genes2.omim_gene_id = '';

    //@ts-ignore
    mockedEntity.genes = getArrangerResultTree(genes);

    const result = getSummaryItems(mockedEntity);
    expect(result).toBeTruthy();
    expect(result[0].rows[0].data[5].value).toEqual(['-']);
  });
});
