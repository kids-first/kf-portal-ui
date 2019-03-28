const randMax = 20100;

export const randomMock = [
  {
    id: 'Pediatric Brain Tumors: CBTTC',
    probands: _.random(0, randMax),
    familyMembers: _.random(0, randMax),
  },
  {
    id: 'Orofacial Cleft: European Ancestry',
    probands: _.random(0, randMax),
    familyMembers: _.random(0, randMax),
  },
  {
    id: 'Ewing Sarcoma: Genetic Risk',
    probands: _.random(0, randMax),
    familyMembers: _.random(0, randMax),
  },
  {
    id: 'Syndromic Cranial Dysinnervation',
    probands: _.random(0, randMax),
    familyMembers: _.random(0, randMax),
  },
  {
    id: 'Congenital Heart Defects',
    probands: _.random(0, randMax),
    familyMembers: _.random(0, randMax),
  },
  {
    id: 'Adolescent nameiopathic Scoliosis',
    probands: _.random(0, randMax),
    familyMembers: _.random(0, randMax),
  },
  {
    id: 'Congenital Diaphragmatic Hernia',
    random: 'xx',
    probands: _.random(0, randMax),
    familyMembers: _.random(0, randMax),
  },
];

export const serverMock = [
  {
    id: 'a',
    probands: 10, //_.random(0, randMax),
    familyMembers: 10, //_.random(0, randMax),
  },
  {
    id: 'b',
    probands: 30, //_.random(0, randMax),
    familyMembers: 30, //_.random(0, randMax),
  },
  {
    id: 'c',
    probands: 60, //_.random(0, randMax),
    familyMembers: 60, //_.random(0, randMax),
  },
  {
    id: 'd',
    probands: 120, //_.random(0, randMax),
    familyMembers: 120, // _.random(0, randMax),
  },
  {
    id: 'e',
    probands: 170, //_.random(0, randMax),
    familyMembers: 170, // _.random(0, randMax),
  },
  {
    id: 'f',
    probands: 240, //_.random(0, randMax),
    familyMembers: 240, // _.random(0, randMax),
  },
  {
    id: 'g',
    random: 'xx',
    probands: 350, //_.random(0, randMax),
    familyMembers: 350, // _.random(0, randMax),
  },
];

export const smallNumberMock = _.map(randomMock, d => ({
  ...d,
  probands: _.random(0, 100),
  familyMembers: _.random(0, 100),
}));

export const largeNumberMock = _.map(randomMock, d => ({
  ...d,
  probands: _.random(25000, 1000000),
  familyMembers: _.random(25000, 1000000),
}));

export const demographicPiesMock = {
  ethnicity: [
    {
      "id": "unknown",
      "label": "Reported Unknown",
      "value": 100
    },
    {
      "id": "notreported",
      "label": "Not Reported",
      "value": 50
    },
    {
      "id": "hol",
      "label": "Hispanic or Latino",
      "value": 25
    },
    {
      "id": "nhok",
      "label": "Not Hispanic or Latino",
      "value": 20
    },
  ],
  familyComposition: [
    {
      "id": "proband",
      "label": "Proband Only",
      "value": 100,
    },
    {
      "id": "trio",
      "label": "Trio",
      "value": 100,
    },
    {
      "id": "trioplus",
      "label": "Trio+",
      "value": 100,
    },
    {
      "id": "duo",
      "label": "Duo",
      "value": 100,
    },
    {
      "id": "duoplus",
      "label": "Duo+",
      "value": 100,
    },
    {
      "id": "other",
      "label": "Other",
      "value": 10,
    },
  ],
  gender: [
    {
      "id": "male",
      "label": "Male",
      "value": 500,
    },
    {
      "id": "female",
      "label": "Female",
      "value": 450,
    },
    {
      "id": "unknown",
      "label": "Reported Unknown",
      "value": 50,
    },
    {
      "id": "unreported",
      "label": "Not Reported",
      "value": 20,
    },
  ],
  race: [
    {
      "id": "morethanone",
      "label": "More Than One Race",
      "value": 100,
    },
    {
      "id": "nativeb",
      "label": "American Indian or Alaska Native ",
      "value": 50,
    },
    {
      "id": "black",
      "label": "Black or African American",
      "value": 50,
    },
    {
      "id": "white",
      "label": "White",
      "value": 50,
    },
    {
      "id": "asian",
      "label": "Asian",
      "value": 50,
    },
    {
      "id": "native",
      "label": "Native Hawaiian or Other Pacific Islander ",
      "value": 50,
    },
    {
      "id": "other",
      "label": "Other",
      "value": 20,
    },
    {
      "id": "unknown",
      "label": "Reported Unknown",
      "value": 10,
    },
    {
      "id": "notreported",
      "label": "Not Reported",
      "value": 5,
    },
  ],
};
