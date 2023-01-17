import intl from 'react-intl-universal';
import { IAnchorLink } from '@ferlab/ui/core/components/AnchorMenu';

import { SectionId } from '..';

const getLinks = (): IAnchorLink[] => [
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

export default getLinks;
