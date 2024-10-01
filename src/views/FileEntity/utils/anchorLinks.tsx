import intl from 'react-intl-universal';
import { IAnchorLink } from '@ferlab/ui/core/components/AnchorMenu';

export enum SectionId {
  SUMMARY = 'summary',
  DATA_ACCESS = 'data-access',
  DATA_TYPE = 'data-type',
  PARTICIPANT_SAMPLE = 'participant-sample',
  EXPERIMENTAL_PROCEDURE = 'experimental-procedure',
  IMAGING = 'imaging',
}

export const getLinks = (showImagingTable: boolean): IAnchorLink[] => {
  const links = [
    { href: `#${SectionId.SUMMARY}`, title: intl.get('entities.file.summary.title') },
    { href: `#${SectionId.DATA_ACCESS}`, title: intl.get('entities.file.data_access.title') },
    { href: `#${SectionId.DATA_TYPE}`, title: intl.get('entities.file.data_type.title') },
    {
      href: `#${SectionId.PARTICIPANT_SAMPLE}`,
      title: intl.get('entities.file.participant_sample.title'),
    },
    {
      href: `#${SectionId.EXPERIMENTAL_PROCEDURE}`,
      title: intl.get('entities.file.experimental_procedure.title'),
    },
  ];

  if (showImagingTable) {
    links.push({
      href: `#${SectionId.IMAGING}`,
      title: intl.get('entities.file.imaging.title'),
    });
  }

  return links;
};
