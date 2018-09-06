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
    description: "I'm interested in genomics research.",
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
      "I'm interested in finding the latest research to target patients' needs based on genetic characteristics.",
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
      "I'm interested in learning more about current research and connecting with others.",
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
      "I'm interested in learning about scientific discoveries in pediatric cancer and structural birth defects.",
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

export const GEN3 = 'gen3';
export const CAVATICA = 'cavatica';
export const SERVICES = [GEN3, CAVATICA];

export const GOOGLE = 'google';
export const FACEBOOK = 'facebook';

export const UI_VERSION = packageJson.version;

export const EGO_JWT_KEY = 'EGO_JWT';

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
    queryName: 'Cheek Swab / Mouth Wash / Salivacop',
    url: `${window.location.protocol}://${
      window.location.host
    }/search/file?sqon=%7B%22op%22%3A%22and%22%2C%22content%22%3A%5B%7B%22op%22%3A%22in%22%2C%22content%22%3A%7B%22field%22%3A%22participants.biospecimens.source_text_tissue_type%22%2C%22value%22%3A%5B%22Cheek%20Swab%22%2C%22Mouth%20Wash%22%2C%22Saliva%22%5D%7D%7D%2C%7B%22op%22%3A%22in%22%2C%22content%22%3A%7B%22field%22%3A%22participants.family.family_compositions.composition%22%2C%22value%22%3A%5B%22trio%22%5D%7D%7D%2C%7B%22op%22%3A%22in%22%2C%22content%22%3A%7B%22field%22%3A%22participants.is_proband%22%2C%22value%22%3A%5B%22true%22%5D%7D%7D%5D%7D`,
    stats: {
      Files: 1434,
      Participants: 478,
      Families: 478,
      Size: '37.76 TB',
    },
    example: true,
  },
  {
    queryName: 'Aligned Reads, trio, HP:0000175, Female',
    url: `${window.location.protocol}://${
      window.location.host
    }/search/file?sqon=%7B%22op%22%3A%22and%22%2C%22content%22%3A%5B%7B%22op%22%3A%22in%22%2C%22content%22%3A%7B%22field%22%3A%22is_harmonized%22%2C%22value%22%3A%5B%22true%22%5D%7D%7D%2C%7B%22op%22%3A%22in%22%2C%22content%22%3A%7B%22field%22%3A%22participants.family.family_compositions.available_data_types%22%2C%22value%22%3A%5B%22Aligned%20Reads%22%5D%7D%7D%2C%7B%22op%22%3A%22in%22%2C%22content%22%3A%7B%22field%22%3A%22participants.family.family_compositions.composition%22%2C%22value%22%3A%5B%22trio%22%5D%7D%7D%2C%7B%22op%22%3A%22in%22%2C%22content%22%3A%7B%22field%22%3A%22participants.family.family_compositions.family_members.phenotype.hpo.hpo_phenotype_observed%22%2C%22value%22%3A%5B%22HP%3A0000175%22%5D%7D%7D%2C%7B%22op%22%3A%22in%22%2C%22content%22%3A%7B%22field%22%3A%22participants.gender%22%2C%22value%22%3A%5B%22Female%22%5D%7D%7D%5D%7D`,
    stats: {
      Files: 738,
      Participants: 369,
      Families: 274,
      Size: '9.34 TB',
    },
    example: true,
  },
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
];
