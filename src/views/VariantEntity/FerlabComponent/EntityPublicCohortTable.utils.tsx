/* eslint-disable complexity */
import { IPublicCohortRow } from '@ferlab/ui/core/pages/EntityPage/type';
import { toExponentialNotation } from '@ferlab/ui/core/utils/numberUtils';
import { IExternalFrequenciesEntity } from '../../../graphql/variants/models';

export const makeRowFromFrequencies = (
  frequencies?: IExternalFrequenciesEntity | undefined,
  locus?: string,
): IPublicCohortRow[] => {
  if (!frequencies || !locus) return [];

  const topmed = frequencies.topmed_bravo || {};
  const gnomadGenomes3 = frequencies.gnomad_genomes_3 || {};
  const gnomadGenomes2_1_1 = frequencies.gnomad_genomes_2_1_1 || {};
  const gnomadExomes2_1_1 = frequencies.gnomad_exomes_2_1_1 || {};
  const thousandGenomes = frequencies.thousand_genomes || {};

  return [
    {
      alt: topmed.ac || null,
      altRef: topmed.an || null,
      cohort: {
        cohortName: 'TopMed',
        link: `https://bravo.sph.umich.edu/freeze8/hg38/variant/snv/${locus}`,
      },
      frequency: toExponentialNotation(topmed.af),
      homozygotes: topmed.hom || null,
      key: 'topmed',
    },
    {
      alt: gnomadGenomes3.ac || null,
      altRef: gnomadGenomes3.an || null,
      cohort: {
        cohortName: 'gnomAD Genomes (v3.1.2)',
        link: `https://gnomad.broadinstitute.org/variant/${locus}?dataset=gnomad_r3`,
      },
      frequency: toExponentialNotation(gnomadGenomes3.af),
      homozygotes: gnomadGenomes3.hom || null,
      key: 'gnomadGenomes3',
    },
    {
      alt: gnomadGenomes2_1_1.ac || null,
      altRef: gnomadGenomes2_1_1.an || null,
      cohort: {
        cohortName: 'gnomAD Genomes (v2.1)',
      },
      frequency: toExponentialNotation(gnomadGenomes2_1_1.af),
      homozygotes: gnomadGenomes2_1_1.hom || null,
      key: 'gnomadGenomes2_1',
    },
    {
      alt: gnomadExomes2_1_1.ac || null,
      altRef: gnomadExomes2_1_1.an || null,
      cohort: {
        cohortName: 'gnomAD Exomes (v2.1)',
      },
      frequency: toExponentialNotation(gnomadExomes2_1_1.af),
      homozygotes: gnomadExomes2_1_1.hom || null,
      key: 'gnomadExomes2_1',
    },
    {
      alt: thousandGenomes.ac || null,
      altRef: thousandGenomes.an || null,
      cohort: {
        cohortName: '1000 Genomes',
      },
      frequency: toExponentialNotation(thousandGenomes.af),
      homozygotes: thousandGenomes.hom || null,
      key: 'oneThousandsGenomes',
    },
  ];
};
