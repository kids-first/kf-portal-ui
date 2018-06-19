import CommunityIcon from 'icons/CommunityIcon';
import ResearchIcon from 'icons/ResearchIcon';
import HealthIcon from 'icons/HealthIcon';
import HealthBanner from 'assets/user-banner-health.png';
import ResearchBanner from 'assets/user-banner-research.png';
import CommunityBanner from 'assets/user-banner-community.png';
import packageJson from '../../package.json';

export const ROLES = [
  {
    type: 'research',
    displayName: 'Research',
    description:
      "I'm a biomedical researcher or data scientist interested in data analysis, cross-disease research, and real-time collaboration.",
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
    type: 'community',
    displayName: 'Community',
    description:
      "I'm part of a patient family or foundation interested in learning more about current research and connecting with researchers in specific disease area.",
    icon: CommunityIcon,
    banner: CommunityBanner,
    color: '#e83a9c',
    profileColors: {
      gradientDark: '#8f347f',
      gradientMid: '#a9408b',
      gradientLight: '#cd5162',
      pillBkg: '#e83a9c',
    },
  },
  {
    type: 'health',
    displayName: 'Health',
    description:
      "I'm a physician-scientist interested in finding the latest research to target patients' needs based on genetic characteristics.",
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
];

export const GEN3 = 'gen3';
export const CAVATICA = 'cavatica';
export const SERVICES = [GEN3, CAVATICA];

export const GOOGLE = 'google';
export const FACEBOOK = 'facebook';

export const UI_VERSION = packageJson.version;

export const EGO_JWT_KEY = 'EGO_JWT';
