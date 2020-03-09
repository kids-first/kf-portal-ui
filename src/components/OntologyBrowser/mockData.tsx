export const flatMockData = [
  {
    key: 'All (HP:0000001)',
    doc_count: 492,
    top_hits: {
      parents: [],
    },
  },
  {
    key: 'Phenotypic abnormality (HP:0000118)',
    doc_count: 492,
    top_hits: {
      parents: ['All (HP:0000001)'],
    },
  },
  {
    key: 'Abnormality of the nervous system (HP:0000707)',
    doc_count: 420,
    top_hits: {
      parents: ['Phenotypic abnormality (HP:0000118)'],
    },
  },
  {
    key: 'Abnormality of nervous system physiology (HP:0012638)',
    doc_count: 353,
    top_hits: {
      parents: ['Abnormality of the nervous system (HP:0000707)'],
    },
  },
  {
    key: 'Seizures (HP:0001250)',
    doc_count: 152,
    top_hits: {
      parents: ['Abnormality of nervous system physiology (HP:0012638)'],
    },
  },
  {
    key: 'Abnormal eye physiology (HP:0012373)',
    doc_count: 134,
    top_hits: {
      parents: ['Abnormality of the eye (HP:0000478)'],
    },
  },
  {
    key: 'Abnormality of the eye (HP:0000478)',
    doc_count: 134,
    top_hits: {
      parents: ['Phenotypic abnormality (HP:0000118)'],
    },
  },
  {
    key: 'Abnormality of vision (HP:0000504)',
    doc_count: 134,
    top_hits: {
      parents: ['Abnormal eye physiology (HP:0012373)'],
    },
  },
  {
    key: 'Reduced visual acuity (HP:0007663)',
    doc_count: 134,
    top_hits: {
      parents: ['Visual impairment (HP:0000505)'],
    },
  },
  {
    key: 'Visual impairment (HP:0000505)',
    doc_count: 134,
    top_hits: {
      parents: ['Abnormality of vision (HP:0000504)'],
    },
  },
  {
    key: 'Abnormality of brain morphology (HP:0012443)',
    doc_count: 121,
    top_hits: {
      parents: ['Morphological abnormality of the central nervous system (HP:0002011)'],
    },
  },
  {
    key: 'Abnormality of nervous system morphology (HP:0012639)',
    doc_count: 121,
    top_hits: {
      parents: ['Abnormality of the nervous system (HP:0000707)'],
    },
  },
  {
    key: 'Abnormality of the cerebral ventricles (HP:0002118)',
    doc_count: 121,
    top_hits: {
      parents: ['Abnormality of brain morphology (HP:0012443)'],
    },
  },
  {
    key: 'Abnormality of the cerebrospinal fluid (HP:0002921)',
    doc_count: 121,
    top_hits: {
      parents: ['Morphological abnormality of the central nervous system (HP:0002011)'],
    },
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
  },
  {
    key: 'Morphological abnormality of the central nervous system (HP:0002011)',
    doc_count: 121,
    top_hits: {
      parents: ['Abnormality of nervous system morphology (HP:0012639)'],
    },
  },
  {
    key: 'Global developmental delay (HP:0001263)',
    doc_count: 46,
    top_hits: {
      parents: ['Neurodevelopmental delay (HP:0012758)'],
    },
  },
  {
    key: 'Neurodevelopmental abnormality (HP:0012759)',
    doc_count: 46,
    top_hits: {
      parents: ['Abnormality of nervous system physiology (HP:0012638)'],
    },
  },
  {
    key: 'Neurodevelopmental delay (HP:0012758)',
    doc_count: 46,
    top_hits: {
      parents: ['Neurodevelopmental abnormality (HP:0012759)'],
    },
  },
  {
    key: 'Autistic behavior (HP:0000729)',
    doc_count: 19,
    top_hits: {
      parents: ['Behavioral abnormality (HP:0000708)'],
    },
  },
  {
    key: 'Behavioral abnormality (HP:0000708)',
    doc_count: 19,
    top_hits: {
      parents: ['Abnormality of nervous system physiology (HP:0012638)'],
    },
  },
];
