import CommunityIcon from 'icons/CommunityIcon';
import ResearchIcon from 'icons/ResearchIcon';
import HealthIcon from 'icons/HealthIcon';
import HealthBanner from 'assets/user-banner-health.png';
import ResearchBanner from 'assets/user-banner-research.png';
import CommunityBanner from 'assets/user-banner-community.png';

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
      gradientDark: 'rgb(38, 109, 177)',
      gradientMid: 'rgb(17, 134, 176)',
      gradientLight: 'rgb(18, 151, 215)',
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
      gradientDark: 'rgb(143, 52, 127)',
      gradientMid: 'rgb(169, 64, 139)',
      gradientLight: 'rgb(205, 81, 98)',
      pillBkg: '#e83a9c',
    },
  },
  {
    type: 'health',
    displayName: 'Health',
    description:
      'I’m interested in finding treatments that can be adapted to target my patients’ needs based on their genetic characteristics.',
    icon: HealthIcon,
    banner: HealthBanner,
    color: '#009bb8',
    profileColors: {
      gradientDark: 'rgb(10, 93, 108)',
      gradientMid: 'rgb(25, 136, 149)',
      gradientLight: 'rgb(28, 163, 158)',
      pillBkg: '#1f9bb6',
    },
  },
];

export const GEN3 = 'gen3';
export const CAVATICA = 'cavatica';
export const SERVICES = [GEN3, CAVATICA];
