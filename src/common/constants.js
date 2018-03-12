import CommunityIcon from 'icons/CommunityIcon';
import ResearchIcon from 'icons/ResearchIcon';
import HealthIcon from 'icons/HealthIcon';
import ResearchBanner from 'assets/user-banner-research.jpg';
import CommunityBanner from 'assets/user-banner-community.jpg';

export const ROLES = [
  {
    type: 'research',
    displayName: 'Research',
    description:
      'I’m interested in complex data analysis, cross-disease research, sharing my findings and collaborating in real time with other Kids First researchers.',
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
      'I’m interested in learning more about the available treatments for a specific disease type and connecting with researchers who are experts in that disease area.',
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
      'I’m interested in finding treatments that can be adapted to target my patients’ needs based on their genetic characteristics.',
    icon: HealthIcon,
    banner: 'tbd',
    color: '#009bb8',
    profileColors: {
      gradientDark: '#0a5d6c',
      gradientMid: '#198895',
      gradientLight: '#1ca39e',
      pillBkg: '#009bb8',
    },
  },
];

export const GEN3 = 'gen3';
export const CAVATICA = 'cavatica';
export const SERVICES = [GEN3, CAVATICA];
