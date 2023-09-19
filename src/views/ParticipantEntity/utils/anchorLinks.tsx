import intl from 'react-intl-universal';
import { IAnchorLink } from '@ferlab/ui/core/components/AnchorMenu';

export enum SectionId {
  SUMMARY = 'summary',
  PROFILE = 'profile',
  FAMILY = 'family',
  DIAGNOSIS = 'diagnosis',
  PHENOTYPE = 'phenotype',
  BIOSPECIMEN = 'biospecimen',
  FILES = 'files',
}

export const getLinks = (showFamilyTable: boolean): IAnchorLink[] => {
  const links = [
    { href: `#${SectionId.SUMMARY}`, title: intl.get('entities.global.summary') },
    { href: `#${SectionId.PROFILE}`, title: intl.get('entities.participant.profile') },
    { href: `#${SectionId.DIAGNOSIS}`, title: intl.get('entities.participant.diagnosis') },
    { href: `#${SectionId.PHENOTYPE}`, title: intl.get('entities.participant.phenotype') },
    {
      href: `#${SectionId.BIOSPECIMEN}`,
      title: intl.get('entities.biospecimen.biospecimen'),
    },
    { href: `#${SectionId.FILES}`, title: intl.get('entities.file.file') },
  ];

  if (showFamilyTable) {
    links.splice(2, 0, {
      href: `#${SectionId.FAMILY}`,
      title: intl.get('entities.participant.family'),
    });
  }

  return links;
};
