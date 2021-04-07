import { makeUnGroupedDataRows } from '../clinical';
const mockGenes1 = [
  {
    node: {
      symbol: 'gene1-NF2',
      omim_gene_id: 'gene1-607379',
      omim: {
        hits: {
          edges: [
            {
              node: {
                omim_id: 'gene1-101000',
                name: 'gene1-Neurofibromatosis, type 2',
                inheritance: ['gene1-AD'],
              },
            },
            {
              node: {
                omim_id: 'gene1-162091',
                name: 'gene1-Schwannomatosis, somatic',
                inheritance: null,
              },
            },
            {
              node: {
                omim_id: 'gene1-607174',
                name: 'gene1-Meningioma, NF2-related, somatic',
                inheritance: null,
              },
            },
          ],
        },
      },
      orphanet: {
        hits: {
          edges: [
            {
              node: {
                panel: 'gene1-Schwannomatosis',
                inheritance: ['gene1-Autosomal dominant'],
                disorder_id: 3434,
              },
            },
            { node: { disorder_id: 1245, panel: 'gene1-Meningioma', inheritance: [] } },
            {
              node: {
                panel: 'gene1-Neurofibromatosis type 2',
                inheritance: ['gene1-Autosomal dominant'],
                disorder_id: 12482,
              },
            },
          ],
        },
      },
      cosmic: {
        hits: {
          edges: [
            {
              node: {
                tumour_types_germline: ['gene1-meningioma', 'gene1-acoustic neuroma'],
              },
            },
          ],
        },
      },
      hpo: {
        hits: {
          edges: [
            {
              node: {
                hpo_term_id: 'gene1-HP:0002512',
                hpo_term_label: 'gene1-Brain stem compression (HP:0002512)',
              },
            },
            {
              node: {
                hpo_term_id: 'gene1-HP:0002512',
                hpo_term_label: 'gene1-Epiretinal membrane (HP:0100014)',
              },
            },
            {
              node: {
                hpo_term_id: 'gene1-HP:0002512',
                hpo_term_label: 'gene1-Progressive pulmonary function impairment (HP:0006520)',
              },
            },
            {
              node: {
                hpo_term_id: 'gene1-HP:0002512',
                hpo_term_label: 'gene1-Visual acuity test abnormality (HP:0030532)',
              },
            },
            {
              node: {
                hpo_term_id: 'gene1-HP:0002512',
                hpo_term_label: 'gene1-Abnormal cerebellum morphology (HP:0001317)',
              },
            },
            {
              node: {
                hpo_term_id: 'gene1-HP:0002512',
                hpo_term_label: 'gene1-Ependymoma (HP:0002888)',
              },
            },
            {
              node: {
                hpo_term_id: 'gene1-HP:0002512',
                hpo_term_label: 'gene1-Bilateral vestibular Schwannoma (HP:0009589)',
              },
            },
            {
              node: {
                hpo_term_id: 'gene1-HP:0002512',
                hpo_term_label: 'gene1-Corneal opacity (HP:0007957)',
              },
            },
            {
              node: {
                hpo_term_id: 'gene1-HP:0002512',
                hpo_term_label: 'gene1-Intracranial meningioma (HP:0100009)',
              },
            },
            {
              node: {
                hpo_term_id: 'gene1-HP:0002512',
                hpo_term_label: 'gene1-Abnormality of the skin (HP:0000951)',
              },
            },
          ],
        },
      },
      ddd: {
        hits: {
          edges: [
            {
              node: {
                disease_name:
                  'gene1-MUSCULAR DYSTROPHY-DYSTROGLYCANOPATHY CONGENITAL WITH MENTAL RETARDATION TYPE B6',
              },
            },
            {
              node: {
                disease_name: 'gene1-MUSCULAR DYSTROPHY-DYSTROGLYCANOPATHY 6',
              },
            },
          ],
        },
      },
    },
  },
  {
    node: {
      symbol: 'gene2-NF2',
      omim_gene_id: 'gene2-607379',
      omim: {
        hits: {
          edges: [
            {
              node: {
                omim_id: 'gene2-101000',
                name: 'gene2-Neurofibromatosis, type 2',
                inheritance: ['gene2-AD'],
              },
            },
            {
              node: {
                omim_id: 'gene2-162091',
                name: ' gene2-Schwannomatosis, somatic',
                inheritance: [],
              },
            },
            {
              node: {
                omim_id: 'gene2-607174',
                name: 'gene2-Meningioma, NF2-related, somatic',
                inheritance: [],
              },
            },
          ],
        },
      },
      orphanet: {
        hits: {
          edges: [
            {
              node: {
                panel: 'gene2-Schwannomatosis',
                inheritance: ['gene2-Autosomal dominant'],
                disorder_id: 124,
              },
            },
            { node: { panel: 'gene2-Meningioma', inheritance: [], disorder_id: 32434 } },
            {
              node: {
                panel: 'gene2-Neurofibromatosis type 2',
                inheritance: ['gene2-Autosomal dominant'],
                disorder_id: 12477,
              },
            },
          ],
        },
      },
      cosmic: {
        hits: {
          edges: [
            {
              node: {
                tumour_types_germline: ['gene2-meningioma', ' gene2-acoustic neuroma'],
              },
            },
          ],
        },
      },
      hpo: {
        hits: {
          edges: [
            {
              node: {
                hpo_term_id: 'gene2-HP:0002512',
                hpo_term_label: 'gene2-Brain stem compression (HP:0002512)',
              },
            },
            {
              node: {
                hpo_term_id: 'gene2-HP:0002512',
                hpo_term_label: 'gene2-Epiretinal membrane (HP:0100014)',
              },
            },
            {
              node: {
                hpo_term_id: 'gene2-HP:0002512',
                hpo_term_label: 'gene2-Progressive pulmonary function impairment (HP:0006520)',
              },
            },
            {
              node: {
                hpo_term_id: 'gene2-HP:0002512',
                hpo_term_label: 'gene2-Visual acuity test abnormality (HP:0030532)',
              },
            },
            {
              node: {
                hpo_term_id: 'gene2-HP:0002512',
                hpo_term_label: 'gene2-Abnormal cerebellum morphology (HP:0001317)',
              },
            },
            {
              node: {
                hpo_term_id: 'gene2-HP:0002512',
                hpo_term_label: 'gene2-Ependymoma (HP:0002888)',
              },
            },
            {
              node: {
                hpo_term_id: 'gene2-HP:0002512',
                hpo_term_label: 'gene2-Bilateral vestibular Schwannoma (HP:0009589)',
              },
            },
          ],
        },
      },
      ddd: { hits: { edges: [] } },
    },
  },
];

const mockGenes2 = [
  {
    node: {
      symbol: 'TRIOBP',
      omim_gene_id: '609761',
      omim: {
        hits: {
          edges: [
            {
              node: {
                omim_id: '609823',
                name: 'Deafness, autosomal recessive 28',
                inheritance: ['AR'],
              },
            },
          ],
        },
      },
      orphanet: {
        hits: {
          edges: [
            {
              node: {
                panel: 'Autosomal recessive non-syndromic sensorineural deafness type DFNB',
                inheritance: ['Autosomal recessive'],
                disorder_id: 12047,
              },
            },
          ],
        },
      },
      cosmic: {
        hits: {
          edges: [],
        },
      },
      hpo: {
        hits: {
          edges: [
            {
              node: {
                hpo_term_label: 'Autosomal recessive inheritance (HP:0000007)',
                hpo_term_id: 'HP:0000007',
              },
            },
            {
              node: {
                hpo_term_label: 'Severe sensorineural hearing impairment (HP:0008625)',
                hpo_term_id: 'HP:0008625',
              },
            },
            {
              node: {
                hpo_term_label: 'Infantile onset (HP:0003593)',
                hpo_term_id: 'HP:0003593',
              },
            },
          ],
        },
      },
      ddd: {
        hits: {
          edges: [],
        },
      },
    },
  },
];

describe('Clinical', () => {
  it('should create a sub table (test data #1)', () => {
    expect(makeUnGroupedDataRows(mockGenes1)).toEqual([
      [
        {
          condition: [
            ['gene1-Schwannomatosis', 3434],
            ['gene1-Meningioma', 1245],
            ['gene1-Neurofibromatosis type 2', 12482],
          ],
          gene: 'gene1-NF2',
          inheritance: ['gene1-Autosomal dominant', 'gene1-Autosomal dominant'],
          source: 'Orphanet',
        },
        {
          condition: [
            ['gene1-Neurofibromatosis, type 2', 'gene1-101000'],
            ['gene1-Schwannomatosis, somatic', 'gene1-162091'],
            ['gene1-Meningioma, NF2-related, somatic', 'gene1-607174'],
          ],
          gene: ['gene1-NF2', 'gene1-607379'],
          inheritance: ['gene1-AD'],
          source: 'OMIM',
        },
        {
          condition: [
            ['gene1-Brain stem compression (HP:0002512)', 'gene1-HP:0002512'],
            ['gene1-Epiretinal membrane (HP:0100014)', 'gene1-HP:0002512'],
            ['gene1-Progressive pulmonary function impairment (HP:0006520)', 'gene1-HP:0002512'],
            ['gene1-Visual acuity test abnormality (HP:0030532)', 'gene1-HP:0002512'],
            ['gene1-Abnormal cerebellum morphology (HP:0001317)', 'gene1-HP:0002512'],
            ['gene1-Ependymoma (HP:0002888)', 'gene1-HP:0002512'],
            ['gene1-Bilateral vestibular Schwannoma (HP:0009589)', 'gene1-HP:0002512'],
            ['gene1-Corneal opacity (HP:0007957)', 'gene1-HP:0002512'],
            ['gene1-Intracranial meningioma (HP:0100009)', 'gene1-HP:0002512'],
            ['gene1-Abnormality of the skin (HP:0000951)', 'gene1-HP:0002512'],
          ],
          gene: 'gene1-NF2',
          inheritance: '--',
          source: 'HPO',
        },
        {
          condition: [
            'gene1-MUSCULAR DYSTROPHY-DYSTROGLYCANOPATHY CONGENITAL WITH MENTAL RETARDATION TYPE B6',
            'gene1-MUSCULAR DYSTROPHY-DYSTROGLYCANOPATHY 6',
          ],
          gene: 'gene1-NF2',
          inheritance: '--',
          source: 'Ddd',
        },
        {
          condition: ['gene1-meningioma', 'gene1-acoustic neuroma'],
          gene: 'gene1-NF2',
          inheritance: '--',
          source: 'Cosmic',
        },
      ],
      [
        {
          condition: [
            ['gene2-Schwannomatosis', 124],
            ['gene2-Meningioma', 32434],
            ['gene2-Neurofibromatosis type 2', 12477],
          ],
          gene: 'gene2-NF2',
          inheritance: ['gene2-Autosomal dominant', 'gene2-Autosomal dominant'],
          source: 'Orphanet',
        },
        {
          condition: [
            ['gene2-Neurofibromatosis, type 2', 'gene2-101000'],
            [' gene2-Schwannomatosis, somatic', 'gene2-162091'],
            ['gene2-Meningioma, NF2-related, somatic', 'gene2-607174'],
          ],
          gene: ['gene2-NF2', 'gene2-607379'],
          inheritance: ['gene2-AD'],
          source: 'OMIM',
        },
        {
          condition: [
            ['gene2-Brain stem compression (HP:0002512)', 'gene2-HP:0002512'],
            ['gene2-Epiretinal membrane (HP:0100014)', 'gene2-HP:0002512'],
            ['gene2-Progressive pulmonary function impairment (HP:0006520)', 'gene2-HP:0002512'],
            ['gene2-Visual acuity test abnormality (HP:0030532)', 'gene2-HP:0002512'],
            ['gene2-Abnormal cerebellum morphology (HP:0001317)', 'gene2-HP:0002512'],
            ['gene2-Ependymoma (HP:0002888)', 'gene2-HP:0002512'],
            ['gene2-Bilateral vestibular Schwannoma (HP:0009589)', 'gene2-HP:0002512'],
          ],
          gene: 'gene2-NF2',
          inheritance: '--',
          source: 'HPO',
        },
        {
          condition: ['gene2-meningioma', ' gene2-acoustic neuroma'],
          gene: 'gene2-NF2',
          inheritance: '--',
          source: 'Cosmic',
        },
      ],
    ]);
  });

  it('should create a sub table (test data #2)', () => {
    expect(makeUnGroupedDataRows(mockGenes2)).toEqual([
      [
        {
          condition: [
            ['Autosomal recessive non-syndromic sensorineural deafness type DFNB', 12047],
          ],
          gene: 'TRIOBP',
          inheritance: ['Autosomal recessive'],
          source: 'Orphanet',
        },
        {
          condition: [['Deafness, autosomal recessive 28', '609823']],
          gene: ['TRIOBP', '609761'],
          inheritance: ['AR'],
          source: 'OMIM',
        },
        {
          condition: [
            ['Autosomal recessive inheritance (HP:0000007)', 'HP:0000007'],
            ['Severe sensorineural hearing impairment (HP:0008625)', 'HP:0008625'],
            ['Infantile onset (HP:0003593)', 'HP:0003593'],
          ],
          gene: 'TRIOBP',
          inheritance: '--',
          source: 'HPO',
        },
      ],
    ]);
  });
});
