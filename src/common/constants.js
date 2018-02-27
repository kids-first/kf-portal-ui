import ClinicianIcon from 'icons/ClinicianIcon';
import PatientIcon from 'icons/PatientIcon';
import ResearcherIcon from 'icons/ResearcherIcon';

export const ROLES = [
  {
    type: 'researcher',
    displayName: 'researcher',
    description:
      'I’m interested in performing complex data analysis, cross-disease research, sharing findings and collaborating in real time.',
    icon: ResearcherIcon,
  },
  {
    type: 'patient',
    displayName: 'Patient/Caregiver',
    description:
      'I’m interested in real-time data summaries, available treatments and browsing investigators who are researching a particular disease.',
    icon: PatientIcon,
  },
  {
    type: 'clinician',
    displayName: 'Clinician',
    description:
      'I’m interested in finding treatments that are more targeted to my patients’ needs based on their genetic characteristics.',
    icon: ClinicianIcon,
  },
  //{
  //type: 'advocacygroup',
  //displayName: 'Advocacy Group',
  //description:
  //'tbd',
  //icon: 'tbd',
  //},
];

export const GEN3 = 'gen3';
export const CAVATICA = 'cavatica';
export const SERVICES = [GEN3, CAVATICA];
