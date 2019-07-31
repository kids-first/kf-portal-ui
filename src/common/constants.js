import CommunityIcon from 'icons/CommunityIcon';
import ResearchIcon from 'icons/ResearchIcon';
import HealthIcon from 'icons/HealthIcon';
import PatientIcon from 'icons/PatientIcon';
import HealthBanner from 'assets/user-banner-health.png';
import ResearchBanner from 'assets/user-banner-research.png';
import CommunityBanner from 'assets/user-banner-community.png';
import PatientBanner from 'assets/user-banner-patient.png';
import packageJson from '../../package.json';

export const ROLES = [
  {
    type: 'research',
    displayName: 'Researcher',
    description:
      'Search, view, analyze, and identify currently accessible data along with your own to support your research',
    icon: ResearchIcon,
    banner: ResearchBanner,
    color: '#00afed',
    profileColors: {
      gradientDark: '#266db1',
      gradientMid: '#1186b0',
      gradientLight: '#1297d7',
      pillBkg: '#00afed',
    },
  },
  {
    type: 'health',
    displayName: 'Healthcare Professional',
    description:
      'Map patients in your disease of interest by disease characteristics and view molecular profiling',
    icon: HealthIcon,
    banner: HealthBanner,
    color: '#009bb8',
    profileColors: {
      gradientDark: '#0a5d6c',
      gradientMid: '#198895',
      gradientLight: '#1ca39e',
      pillBkg: '#1f9bb6',
    },
  },
  {
    type: 'patient',
    displayName: 'Patient/Family Member',
    description:
      'Learn about disease-specific research, become a Kids First partner, and support data sharing',
    icon: PatientIcon,
    banner: PatientBanner,
    color: '#e83a9c',
    profileColors: {
      gradientDark: '#8f347f',
      gradientMid: '#a9408b',
      gradientLight: '#cd5162',
      pillBkg: '#e83a9c',
    },
  },
  {
    type: 'community',
    displayName: 'Community Member',
    description:
      'Learn about scientific discoveries in pediatric cancer and structural birth defects',
    icon: CommunityIcon,
    banner: CommunityBanner,
    color: '#5a69bd',
    profileColors: {
      gradientDark: '#2b388f',
      gradientMid: '#5c6bc0',
      gradientLight: '#7986cb',
      pillBkg: '#5a69bd',
    },
  },
];

export const DCF = 'dcf';
export const GEN3 = 'gen3';
export const FENCES = [GEN3, DCF];

export const CAVATICA = 'cavatica';
export const SERVICES = [...FENCES, CAVATICA];

export const CAVATICA_DATASET_MAPPING = {
  [DCF]: 'sevenbridges/target',
  [GEN3]: 'sevenbridges/kids-first',
};

export const GOOGLE = 'google';
export const FACEBOOK = 'facebook';
export const ORCID = 'orcid';

export const UI_VERSION = packageJson.version;

export const EGO_JWT_KEY = 'EGO_JWT';

export const COHORT_BUILDER_PATH = '/explore';

export const DISEASE_AREAS = [
  'Patients With Both Childhood Cancer And Birth Defects',
  'Childhood Cancer',
  'Cancer',
  'Adolescent Idiopathic Scoliosis',
  'Cancer Susceptibility',
  'Congenital Diaphragmatic Hernia',
  'Craniofacial Microsomia',
  'Disorders Of Sex Development',
  'Enchondromatosis',
  'Ewing Sarcoma',
  'Familial Leukemia',
  'Hearing Loss',
  'Infantile Hemangiomas',
  'Neuroblastoma',
  'Nonsyndromic Craniosynostosis',
  'Orofacial Clefts',
  'Osteosarcoma',
  'Structural Heart & Other Defects',
  'Syndromic Cranial Dysinnervation Disorders',
  'Pediatric Brain Tumors',
];

export const STUDY_SHORT_NAMES = [
  'Orofacial Cleft: European Ancestry',
  'Neuroblastoma Initiation and Progression',
  'Orofacial Cleft: Latin American',
  'Disorders of Sex Development',
  'Adolescent Idiopathic Scoliosis',
  'Congenital Heart Defects',
  'Pediatric Brain Tumors: CBTTC',
  'Ewing Sarcoma: Genetic Risk',
  'Congenital Diaphragmatic Hernia',
];

export const EXAMPLE_QUERIES = [
  {
    queryName: 'All Harmonized Data',
    url: `${window.location.protocol}://${
      window.location.host
    }/search/file?sqon=%7B%22op%22%3A%22and%22%2C%22content%22%3A%5B%7B%22op%22%3A%22in%22%2C%22content%22%3A%7B%22field%22%3A%22is_harmonized%22%2C%22value%22%3A%5B%22true%22%5D%7D%7D%5D%7D`,
    stats: {
      Files: 9194,
      Participants: 3698,
      Families: 1159,
      Size: '108.62 TB',
    },
    example: true,
  },
  {
    queryName:
      'Female probands with cleft palate (HP:0000175) and parents with harmonized aligned reads',
    url: `${window.location.protocol}://${
      window.location.host
    }/search/file?sqon=%7B"op"%3A"and"%2C"content"%3A%5B%7B"op"%3A"in"%2C"content"%3A%7B"field"%3A"data_type"%2C"value"%3A%5B"Aligned%20Reads"%5D%7D%7D%2C%7B"op"%3A"in"%2C"content"%3A%7B"field"%3A"is_harmonized"%2C"value"%3A%5B"true"%5D%7D%7D%2C%7B"op"%3A"in"%2C"content"%3A%7B"field"%3A"participants.diagnoses.source_text_diagnosis"%2C"value"%3A%5B"Cleft%20Palate"%5D%7D%7D%2C%7B"op"%3A"in"%2C"content"%3A%7B"field"%3A"participants.family.family_compositions.composition"%2C"value"%3A%5B"trio"%5D%7D%7D%2C%7B"op"%3A"in"%2C"content"%3A%7B"field"%3A"participants.gender"%2C"value"%3A%5B"Female"%5D%7D%7D%5D%7D`,
    stats: {
      Files: 218,
      Participants: 101,
      Families: 71,
      Size: '1.23 TB',
    },
    example: true,
  },
  {
    queryName: 'Data from oral samples of probands with full trio data',
    url: `${window.location.protocol}://${
      window.location.host
    }/search/file?sqon=%7B"op"%3A"and"%2C"content"%3A%5B%7B"op"%3A"in"%2C"content"%3A%7B"field"%3A"participants.biospecimens.composition"%2C"value"%3A%5B"Cheek%20Swab"%2C"Mouth%20Wash"%2C"Saliva"%5D%7D%7D%2C%7B"op"%3A"in"%2C"content"%3A%7B"field"%3A"participants.family.family_compositions.composition"%2C"value"%3A%5B"trio"%5D%7D%7D%2C%7B"op"%3A"in"%2C"content"%3A%7B"field"%3A"participants.is_proband"%2C"value"%3A%5B"true"%5D%7D%7D%5D%7D`,
    stats: {
      Files: 1434,
      Participants: 478,
      Families: 478,
      Size: '37.76 TB',
    },
    example: true,
  },
];

export const LOGIN_ERROR_DETAILS = {
  unknown:
    'Uh oh, looks like something went wrong. Contact us and we will help investigate why you are unable to sign in.',
  facebook:
    'To sign in with Facebook, please whitelist Facebook in your ad blocker or other privacy settings.',
  thirdPartyData: 'To sign in with Google, please enable third party cookies in your browser.',
};
