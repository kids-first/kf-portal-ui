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
