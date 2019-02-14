export const ageAtDiagnosisBarMock = [
  {
    id: '1',
    label: 'Newborn',
    value: 20,
  },
  {
    id: '2',
    label: '1-5',
    value: 8,
  },
  {
    id: '3',
    label: '5-10',
    value: 9,
  },
  {
    label: '10-15',
    value: 2,
  },
  {
    id: '5',
    label: '15-18',
    value: 5,
  },
  {
    id: '6',
    label: 'Adult',
    value: 1,
  },
];

export const studiesBarMock = [
  {
    id: '1',
    label: 'Orofacial Cleft European ...',
    probands: 415,
    familyMembers: 830,
  },
  {
    id: '2',
    label: 'Ewing Sarcoma Genetic Risk',
    probands: 485,
    familyMembers: 718,
  },
  {
    id: '3',
    label: 'Pediatric Brain Tumors CBTTC',
    probands: 1024,
    familyMembers: 0,
  },
  {
    id: '4',
    label: 'Syndromic Cranial Dysinne...',
    probands: 270,
    familyMembers: 629,
  },
  {
    id: '5',
    label: 'Congenital Heart Defects',
    probands: 297,
    familyMembers: 593,
  },
  {
    id: '6',
    label: 'Congenital Diaphragmatic ...',
    probands: 198,
    familyMembers: 396,
  },
  {
    id: '7',
    label: 'Adolescent Idiopathic Sco...',
    probands: 73,
    familyMembers: 227,
  },
];

export const topDiagnosesBarMock = [
  {
    id: '1',
    label: 'Disease or Disorder',
    familyMembers: 50,
    probands: 50,
  },
  {
    id: '2',
    label: 'Medulloblastoma',
    familyMembers: 50,
    probands: 50,
  },
  {
    id: '3',
    label: 'Epilepsy',
    familyMembers: 50,
    probands: 50,
  },
  {
    id: '4',
    label: 'Nervous System Disorder',
    familyMembers: 50,
    probands: 50,
  },
  {
    id: '5',
    label: 'Adolescent Idiopathic Sco...',
    familyMembers: 50,
    probands: 50,
  },
  {
    id: '6',
    label: 'Congenital Diaphragmatic ...',
    familyMembers: 50,
    probands: 50,
  },
  {
    id: '7',
    label: 'Low Grade Glioma',
    familyMembers: 50,
    probands: 50,
  },
  {
    id: '8',
    label: 'Cleft Lip Palate',
    familyMembers: 50,
    probands: 50,
  },
  {
    id: '9',
    label: 'Ewing Sarcoma',
    familyMembers: 50,
    probands: 50,
  },
];

export const demographicPiesMock = {
  ethnicity: [
    {
      id: 'unknown',
      label: 'Reported Unknown',
      value: 100,
    },
    {
      id: 'notreported',
      label: 'Not Reported',
      value: 50,
    },
    {
      id: 'hol',
      label: 'Hispanic or Latino',
      value: 25,
    },
    {
      id: 'nhok',
      label: 'Not Hispanic or Latino',
      value: 20,
    },
  ],
  familyComposition: [
    {
      id: 'proband',
      label: 'Proband Only',
      value: 100,
    },
    {
      id: 'trio',
      label: 'Trio',
      value: 100,
    },
    {
      id: 'trioplus',
      label: 'Trio+',
      value: 100,
    },
    {
      id: 'duo',
      label: 'Duo',
      value: 100,
    },
    {
      id: 'duoplus',
      label: 'Duo+',
      value: 100,
    },
    {
      id: 'other',
      label: 'Other',
      value: 10,
    },
  ],
  gender: [
    {
      id: 'male',
      label: 'Male',
      value: 500,
    },
    {
      id: 'female',
      label: 'Female',
      value: 450,
    },
    {
      id: 'unknown',
      label: 'Reported Unknown',
      value: 50,
    },
    {
      id: 'unreported',
      label: 'Not Reported',
      value: 20,
    },
  ],
  race: [
    {
      id: 'morethanone',
      label: 'More Than One Race',
      value: 100,
    },
    {
      id: 'nativeb',
      label: 'American Indian or Alaska Native ',
      value: 50,
    },
    {
      id: 'black',
      label: 'Black or African American',
      value: 50,
    },
    {
      id: 'white',
      label: 'White',
      value: 50,
    },
    {
      id: 'asian',
      label: 'Asian',
      value: 50,
    },
    {
      id: 'native',
      label: 'Native Hawaiian or Other Pacific Islander ',
      value: 50,
    },
    {
      id: 'other',
      label: 'Other',
      value: 20,
    },
    {
      id: 'unknown',
      label: 'Reported Unknown',
      value: 10,
    },
    {
      id: 'notreported',
      label: 'Not Reported',
      value: 5,
    },
  ],
};

export const survivalPlotMock = {
  donors: [
    {
      project_id: 'Congenital Diaphragmatic Hernia',
      censored: true,
      time: 6,
      survivalEstimate: 1,
      submitter_id: 'PT_FCS416QR',
      id: '2c30dc20-18a8-44f9-ab10-558c1e5634dc',
    },
    {
      project_id: 'Congenital Diaphragmatic Hernia',
      censored: true,
      time: 14,
      survivalEstimate: 1,
      submitter_id: 'PT_ARN1D5B8',
      id: '26a12266-c6d8-42f9-bd4e-5093d827ac9a',
    },
    {
      project_id: 'Congenital Diaphragmatic Hernia',
      censored: true,
      time: 16,
      survivalEstimate: 0.95,
      submitter_id: 'PT_TQPMJMDF',
      id: '01240896-3f3f-4bf9-9799-55c87bfacf36',
    },
    {
      project_id: 'Congenital Diaphragmatic Hernia',
      censored: true,
      time: 28,
      survivalEstimate: 0.82,
      submitter_id: 'PT_5HYPY6F9',
      id: '6fa41234-9077-4d05-a295-6820f3bedf5b',
    },
    {
      project_id: 'Congenital Diaphragmatic Hernia',
      censored: true,
      time: 32,
      survivalEstimate: 0.7,
      submitter_id: 'PT_BADD0N51',
      id: 'c46971a1-cbac-425d-bac2-f4142c92522e',
    },
    {
      project_id: 'Congenital Diaphragmatic Hernia',
      censored: true,
      time: 44,
      survivalEstimate: 0.44,
      submitter_id: 'PT_GJYKSGM5',
      id: 'c46971a1-cbac-425d-bac2-f4142c92522e',
    },
    {
      project_id: 'Congenital Diaphragmatic Hernia',
      censored: true,
      time: 62,
      survivalEstimate: 0.32,
      submitter_id: 'PT_1KYPR4ZK',
      id: 'c46971a1-cbac-425d-bac2-f4142c92522e',
    },
  ],
};
