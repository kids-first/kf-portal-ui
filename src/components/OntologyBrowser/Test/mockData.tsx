import { TreeNode } from '../Model';
import { PhenotypeSource } from '../store';

export const flatMockData: PhenotypeSource[] = [
  {
    key: 'All (HP:0000001)',
    doc_count: 492,
    top_hits: {
      parents: [],
    },
    filter_by_term: '',
  },
  {
    key: 'Phenotypic abnormality (HP:0000118)',
    doc_count: 492,
    top_hits: {
      parents: ['All (HP:0000001)'],
    },
    filter_by_term: '',
  },
  {
    key: 'Abnormality of the nervous system (HP:0000707)',
    doc_count: 420,
    top_hits: {
      parents: ['Phenotypic abnormality (HP:0000118)'],
    },
    filter_by_term: '',
  },
  {
    key: 'Abnormality of nervous system physiology (HP:0012638)',
    doc_count: 353,
    top_hits: {
      parents: ['Abnormality of the nervous system (HP:0000707)'],
    },
    filter_by_term: '',
  },
  {
    key: 'Seizures (HP:0001250)',
    doc_count: 367,
    top_hits: {
      parents: ['Abnormality of nervous system physiology (HP:0012638)'],
    },
    filter_by_term: '',
  },
  {
    key: 'Abnormal eye physiology (HP:0012373)',
    doc_count: 134,
    top_hits: {
      parents: ['Abnormality of the eye (HP:0000478)'],
    },
    filter_by_term: '',
  },
  {
    key: 'Abnormality of the eye (HP:0000478)',
    doc_count: 200,
    top_hits: {
      parents: ['Phenotypic abnormality (HP:0000118)'],
    },
    filter_by_term: '',
  },
  {
    key: 'Abnormality of vision (HP:0000504)',
    doc_count: 134,
    top_hits: {
      parents: ['Abnormal eye physiology (HP:0012373)'],
    },
    filter_by_term: '',
  },
  {
    key: 'Reduced visual acuity (HP:0007663)',
    doc_count: 134,
    top_hits: {
      parents: ['Visual impairment (HP:0000505)'],
    },
    filter_by_term: '',
  },
  {
    key: 'Visual impairment (HP:0000505)',
    doc_count: 134,
    top_hits: {
      parents: ['Abnormality of vision (HP:0000504)'],
    },
    filter_by_term: '',
  },
  {
    key: 'Abnormality of brain morphology (HP:0012443)',
    doc_count: 121,
    top_hits: {
      parents: ['Morphological abnormality of the central nervous system (HP:0002011)'],
    },
    filter_by_term: '',
  },
  {
    key: 'Abnormality of nervous system morphology (HP:0012639)',
    doc_count: 221,
    top_hits: {
      parents: ['Abnormality of the nervous system (HP:0000707)'],
    },
    filter_by_term: '',
  },
  {
    key: 'Abnormality of the cerebral ventricles (HP:0002118)',
    doc_count: 121,
    top_hits: {
      parents: ['Abnormality of brain morphology (HP:0012443)'],
    },
    filter_by_term: '',
  },
  {
    key: 'Abnormality of the cerebrospinal fluid (HP:0002921)',
    doc_count: 121,
    top_hits: {
      parents: ['Morphological abnormality of the central nervous system (HP:0002011)'],
    },
    filter_by_term: '',
  },
  {
    key: 'Hydrocephalus (HP:0000238)',
    doc_count: 121,
    top_hits: {
      parents: [
        'Abnormality of the cerebral ventricles (HP:0002118)',
        'Abnormality of the cerebrospinal fluid (HP:0002921)',
      ],
    },
    filter_by_term: '',
  },
  {
    key: 'Morphological abnormality of the central nervous system (HP:0002011)',
    doc_count: 121,
    top_hits: {
      parents: ['Abnormality of nervous system morphology (HP:0012639)'],
    },
    filter_by_term: '',
  },
  {
    key: 'Global developmental delay (HP:0001263)',
    doc_count: 46,
    top_hits: {
      parents: ['Neurodevelopmental delay (HP:0012758)'],
    },
    filter_by_term: '',
  },
  {
    key: 'Neurodevelopmental abnormality (HP:0012759)',
    doc_count: 46,
    top_hits: {
      parents: ['Abnormality of nervous system physiology (HP:0012638)'],
    },
    filter_by_term: '',
  },
  {
    key: 'Neurodevelopmental delay (HP:0012758)',
    doc_count: 46,
    top_hits: {
      parents: ['Neurodevelopmental abnormality (HP:0012759)'],
    },
    filter_by_term: '',
  },
  {
    key: 'Autistic behavior (HP:0000729)',
    doc_count: 19,
    top_hits: {
      parents: ['Behavioral abnormality (HP:0000708)'],
    },
    filter_by_term: '',
  },
  {
    key: 'Behavioral abnormality (HP:0000708)',
    doc_count: 19,
    top_hits: {
      parents: ['Abnormality of nervous system physiology (HP:0012638)'],
    },
    filter_by_term: '',
  },
];

export const treeData: TreeNode[] = [
  {
    title: 'Abnormality of the integument (HP:0001574)',
    text: 'Abnormality of the integument (HP:0001574)',
    key: 'Abnormality of the integument (HP:0001574)',
    results: 100,
    exactTagCount: 0,
    valueText: 2120,
    children: [
      {
        title: 'Abnormality of the skin (HP:0000951)',
        text: 'Abnormality of the skin (HP:0000951)',
        key: 'Abnormality of the integument (HP:0001574)-Abnormality of the skin (HP:0000951)',
        results: 6,
        exactTagCount: 2,
        valueText: 1960,
        value: 1954,
        children: [
          {
            title: 'Abnormality of skin morphology (HP:0011121)',
            text: 'Abnormality of skin morphology (HP:0011121)',
            key:
              'Abnormality of the integument (HP:0001574)-Abnormality of the skin (HP:0000951)' +
              '-Abnormality of skin morphology (HP:0011121)',
            results: 4,
            exactTagCount: 4,
            valueText: 1960,
            children: [
              {
                title: 'Skin appendage neoplasm (HP:0012842)',
                text: 'Skin appendage neoplasm (HP:0012842)',
                key:
                  'Abnormality of the integument (HP:0001574)-Abnormality of the skin (HP:0000951)' +
                  '-Abnormality of skin morphology (HP:0011121)' +
                  'Skin appendage neoplasm (HP:0012842)',
                results: 2,
                exactTagCount: 2,
                children: [],
                value: 1960,
                valueText: 1960,
              },
            ],
          },
        ],
      },
      {
        title: 'Abnormality of skin adnexa morphology (HP:0011138)',
        text: 'Abnormality of skin adnexa morphology (HP:0011138)',
        key:
          'Abnormality of the integument (HP:0001574)-' +
          'Abnormality of skin adnexa morphology (HP:0011138)',
        results: 6,
        exactTagCount: 1,
        valueText: 160,
        children: [
          {
            title: 'Skin appendage neoplasm (HP:0012842)',
            text: 'Skin appendage neoplasm (HP:0012842)',
            key:
              'Abnormality of the integument (HP:0001574)-' +
              'Abnormality of skin adnexa morphology (HP:0011138)-' +
              'Skin appendage neoplasm (HP:0012842)',
            results: 2,
            exactTagCount: 2,
            value: 12,
            valueText: 12,
            children: [],
          },
          {
            title: 'Abnormal hair morphology (HP:0001595)',
            text: 'Abnormal hair morphology (HP:0001595)',
            key:
              'Abnormality of the integument (HP:0001574)-' +
              'Abnormality of skin adnexa morphology (HP:0011138)-' +
              'Abnormal hair morphology (HP:0001595)',
            results: 2,
            exactTagCount: 2,
            value: 24,
            valueText: 24,
            children: [],
          },
          {
            title: 'Custom term xyz',
            text: 'Custom term xyz',
            key:
              'Abnormality of the integument (HP:0001574)-' +
              'Abnormality of skin adnexa morphology (HP:0011138)-' +
              'Custom term xyz',
            results: 1,
            exactTagCount: 1,
            value: 112,
            valueText: 112,
            children: [],
          },
        ],
      },
    ],
  },
];
