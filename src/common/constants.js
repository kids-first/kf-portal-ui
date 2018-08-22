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
  'Neuroblastoma Initiation and Progressio ',
  'Orofacial Cleft: Latin America ',
  'Disorders of Sex Developmen ',
  'Adolescent Idiopathic Scoliosi ',
  'Congenital Heart Defect ',
  'Pediatric Brain Tumors: CBTT ',
  'Ewing Sarcoma: Genetic Ris ',
  'Congenital Diaphragmatic Herni ',
];
