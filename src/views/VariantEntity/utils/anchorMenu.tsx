import intl from 'react-intl-universal';
import { IAnchorLink } from '@ferlab/ui/core/components/AnchorMenu';

export enum SectionId {
  SUMMARY = 'summary',
  CONSEQUENCE = 'consequence',
  FREQUENCY = 'frequency',
  PATHOGENICITY = 'pathogenicity',
  CONDITION = 'condition',
}

export const links: IAnchorLink[] = [
  { href: `#${SectionId.SUMMARY}`, title: intl.get('screen.variants.summary.summary') },
  {
    href: `#${SectionId.CONSEQUENCE}`,
    title: intl.get('screen.variants.consequences.consequence'),
  },
  { href: `#${SectionId.FREQUENCY}`, title: intl.get('screen.variants.frequencies.frequency') },
  {
    href: `#${SectionId.PATHOGENICITY}`,
    title: intl.get('screen.variants.pathogenicity.pathogenicity'),
  },
  {
    href: `#${SectionId.CONDITION}`,
    title: intl.get('screen.variants.conditions.title'),
  },
];
