import intl from 'react-intl-universal';
import { UserOutlined } from '@ant-design/icons';
import SidebarMenu, { ISidebarMenuItem } from '@ferlab/ui/core/components/SidebarMenu';
import { RangeOperators } from '@ferlab/ui/core/data/sqon/operators';
import ScrollContent from '@ferlab/ui/core/layout/ScrollContent';
import { INDEXES } from 'graphql/constants';

import DiseaseIcon from 'components/Icons/DiseaseIcon';
import FrequencyIcon from 'components/Icons/FrequencyIcon';
import GeneIcon from 'components/Icons/GeneIcon';
import LineStyleIcon from 'components/Icons/LineStyleIcon';
import FilterList from 'components/uiKit/FilterList';
import { FilterInfo } from 'components/uiKit/FilterList/types';
import useGetExtendedMappings from 'hooks/graphql/useGetExtendedMappings';
import { SuggestionType } from 'services/api/arranger/models';

import GenesUploadIds from './components/GeneUploadIds';
import PageContent from './components/PageContent';
import VariantGeneSearch from './components/VariantGeneSearch';
import { VARIANT_REPO_QB_ID } from './utils/constants';
import { SCROLL_WRAPPER_ID } from './utils/constants';

import styles from './index.module.css';

enum FilterTypes {
  Participant,
  Variant,
  Gene,
  Frequency,
  Pathogenicity,
}

enum FilterKeys {
  PARTICIPANT = 'participant',
  VARIANTS = 'variants',
  GENES = 'genes',
  PATHOGENICITY = 'pathogenicity',
  FREQUENCY = 'frequency',
}

const filterGroups: {
  [type: string]: FilterInfo;
} = {
  [FilterTypes.Participant]: {
    groups: [
      {
        facets: ['studies__study_code'],
      },
    ],
  },
  [FilterTypes.Variant]: {
    customSearches: [
      <VariantGeneSearch
        key="variants"
        type={SuggestionType.VARIANTS}
        queryBuilderId={VARIANT_REPO_QB_ID}
        analyticsName={intl.get('global.googleAnalytics.germline')}
      />,
    ],
    groups: [
      {
        facets: [
          'variant_class',
          'genes__consequences__consequence',
          'variant_external_reference',
          'chromosome',
          'start',
          'studies__zygosity',
          'studies__transmission',
        ],
        defaults: {
          start: {
            operator: RangeOperators['between'],
          },
        },
        noDataOption: ['start'],
        intervalDecimal: {
          start: 0,
        },
      },
    ],
  },
  [FilterTypes.Gene]: {
    customSearches: [
      <VariantGeneSearch
        key="genes"
        type={SuggestionType.GENES}
        queryBuilderId={VARIANT_REPO_QB_ID}
        analyticsName={intl.get('global.googleAnalytics.germline')}
      />,
      <GenesUploadIds key="genes_upload_ids" queryBuilderId={VARIANT_REPO_QB_ID} />,
    ],
    groups: [
      {
        facets: [
          'genes__biotype',
          'gene_external_reference',
          'genes__gnomad__pli',
          'genes__gnomad__loeuf',
        ],
        defaults: {
          genes__gnomad__pli: {
            operator: RangeOperators['>'],
          },
        },
        noDataOption: ['genes__gnomad__pli', 'genes__gnomad__loeuf'],
      },
      {
        title: intl.get('facets.genePanels'),
        facets: [
          'genes__hpo__hpo_term_label',
          'genes__orphanet__panel',
          'genes__omim__name',
          'genes__ddd__disease_name',
          'genes__cosmic__tumour_types_germline',
        ],
        tooltips: [
          'genes__hpo__hpo_term_label',
          'genes__omim__name',
          'genes__ddd__disease_name',
          'genes__cosmic__tumour_types_germline',
        ],
      },
    ],
  },
  [FilterTypes.Pathogenicity]: {
    groups: [
      {
        facets: ['clinvar__clin_sig', 'genes__consequences__vep_impact'],
        tooltips: ['genes__consequences__vep_impact'],
      },
      {
        title: 'Predictions',
        facets: [
          'genes__consequences__predictions__cadd_score',
          'genes__consequences__predictions__cadd_phred',
          'genes__consequences__predictions__dann_score',
          'genes__consequences__predictions__fathmm_pred',
          'genes__consequences__predictions__lrt_pred',
          'genes__consequences__predictions__polyphen2_hvar_pred',
          'genes__consequences__predictions__revel_score',
          'genes__spliceai__ds',
          'genes__consequences__predictions__sift_pred',
        ],
        defaults: {
          genes__consequences__predictions__cadd_score: {
            operator: RangeOperators['>'],
          },
          genes__consequences__predictions__cadd_phred: {
            operator: RangeOperators['>'],
          },
          genes__consequences__predictions__dann_score: {
            operator: RangeOperators['>'],
          },
          genes__consequences__predictions__revel_score: {
            operator: RangeOperators['>'],
          },
          genes__spliceai__ds: {
            operator: RangeOperators['>'],
          },
        },
        tooltips: [
          'genes__consequences__predictions__cadd_score',
          'genes__consequences__predictions__cadd_phred',
          'genes__consequences__predictions__dann_score',
          'genes__consequences__predictions__fathmm_pred',
          'genes__consequences__predictions__lrt_pred',
          'genes__consequences__predictions__polyphen2_hvar_pred',
          'genes__consequences__predictions__revel_score',
          'genes__consequences__predictions__sift_pred',
        ],
        noDataOption: [
          'genes__consequences__predictions__cadd_score',
          'genes__consequences__predictions__cadd_phred',
          'genes__consequences__predictions__dann_score',
          'genes__consequences__predictions__revel_score',
          'genes__spliceai__ds',
          'genes__consequences__predictions__sift_pred',
        ],
      },
    ],
  },
  [FilterTypes.Frequency]: {
    groups: [
      {
        facets: [
          'internal_frequencies__total__af',
          'external_frequencies__gnomad_genomes_2_1_1__af',
          'external_frequencies__gnomad_genomes_3__af',
          'external_frequencies__gnomad_exomes_2_1_1__af',
          'external_frequencies__topmed_bravo__af',
          'external_frequencies__thousand_genomes__af',
        ],
        noDataOption: [
          'internal_frequencies__total__af',
          'external_frequencies__gnomad_genomes_2_1_1__af',
          'external_frequencies__gnomad_genomes_3__af',
          'external_frequencies__gnomad_exomes_2_1_1__af',
          'external_frequencies__topmed_bravo__af',
          'external_frequencies__thousand_genomes__af',
        ],
      },
    ],
  },
};

const Variants = () => {
  const participantMappingResults = useGetExtendedMappings(INDEXES.PARTICIPANT);
  const variantMappingResults = useGetExtendedMappings(INDEXES.VARIANTS);
  const menuItems: ISidebarMenuItem[] = [
    {
      key: '1',
      title: intl.get('screen.variants.sidemenu.participant'),
      icon: <UserOutlined />,
      panelContent: (
        <FilterList
          loading={participantMappingResults.loading}
          key={FilterKeys.VARIANTS}
          index={INDEXES.VARIANTS}
          queryBuilderId={VARIANT_REPO_QB_ID}
          extendedMappingResults={variantMappingResults}
          filterInfo={filterGroups[FilterTypes.Participant]}
          analyticsName={intl.get('global.googleAnalytics.germline')}
        />
      ),
    },
    {
      key: '2',
      title: intl.get('screen.variants.sidemenu.variant'),
      icon: <LineStyleIcon />,
      panelContent: (
        <FilterList
          loading={variantMappingResults.loading}
          key={FilterKeys.VARIANTS}
          index={INDEXES.VARIANTS}
          queryBuilderId={VARIANT_REPO_QB_ID}
          extendedMappingResults={variantMappingResults}
          filterInfo={filterGroups[FilterTypes.Variant]}
          analyticsName={intl.get('global.googleAnalytics.germline')}
        />
      ),
    },
    {
      key: '3',
      title: intl.get('screen.variants.sidemenu.gene'),
      icon: <GeneIcon />,
      panelContent: (
        <FilterList
          loading={variantMappingResults.loading}
          key={FilterKeys.GENES}
          index={INDEXES.VARIANTS}
          queryBuilderId={VARIANT_REPO_QB_ID}
          extendedMappingResults={variantMappingResults}
          filterInfo={filterGroups[FilterTypes.Gene]}
          analyticsName={intl.get('global.googleAnalytics.germline')}
        />
      ),
    },
    {
      key: '4',
      title: intl.get('screen.variants.sidemenu.pathogenicity'),
      icon: <DiseaseIcon />,
      panelContent: (
        <FilterList
          loading={variantMappingResults.loading}
          key={FilterKeys.PATHOGENICITY}
          index={INDEXES.VARIANTS}
          queryBuilderId={VARIANT_REPO_QB_ID}
          extendedMappingResults={variantMappingResults}
          filterInfo={filterGroups[FilterTypes.Pathogenicity]}
          analyticsName={intl.get('global.googleAnalytics.germline')}
        />
      ),
    },
    {
      key: '5',
      title: intl.get('screen.variants.sidemenu.frequency'),
      icon: <FrequencyIcon />,
      panelContent: (
        <FilterList
          loading={variantMappingResults.loading}
          key={FilterKeys.FREQUENCY}
          index={INDEXES.VARIANTS}
          queryBuilderId={VARIANT_REPO_QB_ID}
          extendedMappingResults={variantMappingResults}
          filterInfo={filterGroups[FilterTypes.Frequency]}
          analyticsName={intl.get('global.googleAnalytics.germline')}
        />
      ),
    },
  ];

  return (
    <div className={styles.variantsLayout}>
      <SidebarMenu className={styles.sideMenu} menuItems={menuItems} />
      <ScrollContent id={SCROLL_WRAPPER_ID} className={styles.scrollContent}>
        <PageContent variantMapping={variantMappingResults} filterGroups={filterGroups} />
      </ScrollContent>
    </div>
  );
};

export default Variants;
