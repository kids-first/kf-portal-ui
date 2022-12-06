import intl from 'react-intl-universal';
import { UserOutlined } from '@ant-design/icons';
import SidebarMenu, { ISidebarMenuItem } from '@ferlab/ui/core/components/SidebarMenu';
import ScrollContent from '@ferlab/ui/core/layout/ScrollContent';
import { INDEXES } from 'graphql/constants';
import TreeFacet from 'views/DataExploration/components/TreeFacet';
import { formatHpoTitleAndCode, formatMondoTitleAndCode } from 'views/DataExploration/utils/helper';
import GenesUploadIds from 'views/Variants/components/GeneUploadIds';
import VariantGeneSearch from 'views/Variants/components/VariantGeneSearch';
import { VARIANT_REPO_QB_ID } from 'views/Variants/utils/constants';

import DiseaseIcon from 'components/Icons/DiseaseIcon';
import FrequencyIcon from 'components/Icons/FrequencyIcon';
import GeneIcon from 'components/Icons/GeneIcon';
import LineStyleIcon from 'components/Icons/LineStyleIcon';
import FilterList from 'components/uiKit/FilterList';
import { FilterInfo } from 'components/uiKit/FilterList/types';
import useGetExtendedMappings from 'hooks/graphql/useGetExtendedMappings';
import { SuggestionType } from 'services/api/arranger/models';

import PageContent from './components/PageContent';
import { SCROLL_WRAPPER_ID } from './utils/constants';

import styles from 'views/Variants/index.module.scss';

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
        facets: [
          'studies__study_code',
          <TreeFacet
            type={'hpoTree'}
            field={'observed_phenotype'}
            titleFormatter={formatHpoTitleAndCode}
            key={'observed_phenotype'}
          />,
          <TreeFacet
            type={'mondoTree'}
            field={'mondo'}
            titleFormatter={formatMondoTitleAndCode}
            key={'mondo'}
          />,
        ],
      },
    ],
  },
  [FilterTypes.Variant]: {
    customSearches: [
      <VariantGeneSearch
        key="variants"
        type={SuggestionType.VARIANTS}
        queryBuilderId={VARIANT_REPO_QB_ID}
      />,
    ],
    groups: [
      {
        facets: [
          'variant_class',
          'consequences__consequences',
          'variant_external_reference',
          'chromosome',
          'start',
          'zygosity',
          'transmissions',
        ],
      },
    ],
  },
  [FilterTypes.Gene]: {
    customSearches: [
      <VariantGeneSearch
        key="genes"
        type={SuggestionType.GENES}
        queryBuilderId={VARIANT_REPO_QB_ID}
      />,
      <GenesUploadIds key="genes_upload_ids" queryBuilderId={VARIANT_REPO_QB_ID} />,
    ],
    groups: [
      {
        facets: ['consequences__biotype', 'gene_external_reference'],
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
        facets: ['clinvar__clin_sig', 'consequences__vep_impact'],
        tooltips: ['consequences__vep_impact'],
      },
      {
        title: 'Predictions',
        facets: [
          'consequences__predictions__cadd_rankscore',
          'consequences__predictions__dann_rankscore',
          'consequences__predictions__fathmm_pred',
          'consequences__predictions__lrt_pred',
          'consequences__predictions__polyphen2_hvar_pred',
          'consequences__predictions__revel_rankscore',
          'consequences__predictions__sift_pred',
        ],
        tooltips: [
          'consequences__predictions__cadd_rankscore',
          'consequences__predictions__dann_rankscore',
          'consequences__predictions__fathmm_pred',
          'consequences__predictions__lrt_pred',
          'consequences__predictions__polyphen2_hvar_pred',
          'consequences__predictions__revel_rankscore',
          'consequences__predictions__sift_pred',
        ],
      },
    ],
  },
  [FilterTypes.Frequency]: {
    groups: [
      {
        facets: [
          'frequencies__internal__upper_bound_kf__af',
          'frequencies__gnomad_genomes_2_1__af',
          'frequencies__gnomad_genomes_3_0__af',
          'frequencies__gnomad_genomes_3_1_1__af',
          'frequencies__gnomad_exomes_2_1__af',
          'frequencies__topmed__af',
          'frequencies__one_thousand_genomes__af',
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
        />
      ),
    },
  ];

  return (
    <div className={styles.variantsLayout}>
      <SidebarMenu className={styles.sideMenu} menuItems={menuItems} />
      <ScrollContent id={SCROLL_WRAPPER_ID} className={styles.scrollContent}>
        <PageContent variantMapping={variantMappingResults} />
      </ScrollContent>
    </div>
  );
};

export default Variants;
