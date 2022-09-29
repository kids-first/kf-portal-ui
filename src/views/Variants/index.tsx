import intl from 'react-intl-universal';
import { useParams } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import SidebarMenu, { ISidebarMenuItem } from '@ferlab/ui/core/components/SidebarMenu';
import ScrollContent from '@ferlab/ui/core/layout/ScrollContent';
import { INDEXES } from 'graphql/constants';
import ParticipantSearch from 'views/DataExploration/components/ParticipantSearch';
import TreeFacet from 'views/DataExploration/components/TreeFacet';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';
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
import { mapFilterForParticipant, mapFilterForVariant } from 'utils/fieldMapper';
import { getFTEnvVarByKey } from 'helpers/EnvVariables';
import {
  FT_VARIANT_FACET_PARTICIPANT,
  FT_VARIANT_FACET_VARIANT,
  FT_VARIANT_FACET_GENE,
  FT_VARIANT_FACET_PATHOGENICITY,
  FT_VARIANT_FACET_FREQUENTY,
} from 'common/featureToggle';

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
    customSearches: [<ParticipantSearch key={0} queryBuilderId={DATA_EXPLORATION_QB_ID} />],
    groups: [
      {
        facets: [
          'study__study_code',
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
          'clinvar__clin_sig',
          'consequences__vep_impact',
        ],
      },
    ],
  },
  [FilterTypes.Pathogenicity]: {
    groups: [
      {
        title: 'Predictions',
        facets: [
          'consequences__predictions__sift_pred',
          'consequences__predictions__polyphen2_hvar_pred',
          'consequences__predictions__fathmm_pred',
          'consequences__predictions__cadd_rankscore',
          'consequences__predictions__dann_rankscore',
          'consequences__predictions__lrt_pred',
          'consequences__predictions__revel_rankscore',
        ],
      },
    ],
  },
  [FilterTypes.Frequency]: {
    groups: [
      {
        title: intl.get('screen.patientsnv.filter.grouptitle.publiccohorts'),
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
  const { tab } = useParams<{ tab: string }>();
  const participantMappingResults = useGetExtendedMappings(INDEXES.PARTICIPANT);
  const variantMappingResults = useGetExtendedMappings(INDEXES.VARIANTS);
  const menuItems: ISidebarMenuItem[] = [];

  if (getFTEnvVarByKey(FT_VARIANT_FACET_PARTICIPANT) !== 'false') {
    menuItems.push({
      key: '1',
      title: intl.get('screen.variants.sidemenu.participant'),
      icon: <UserOutlined className={styles.sideMenuIcon} />,
      panelContent: (
        <FilterList
          loading={participantMappingResults.loading}
          key={FilterKeys.PARTICIPANT}
          index={INDEXES.PARTICIPANT}
          queryBuilderId={VARIANT_REPO_QB_ID}
          extendedMappingResults={participantMappingResults}
          filterInfo={filterGroups[FilterTypes.Participant]}
          filterMapper={mapFilterForParticipant}
        />
      ),
    });
  }

  if (getFTEnvVarByKey(FT_VARIANT_FACET_VARIANT) !== 'false') {
    menuItems.push({
      key: '2',
      title: intl.get('screen.variants.sidemenu.variant'),
      icon: <LineStyleIcon className={styles.sideMenuIcon} />,
      panelContent: (
        <FilterList
          loading={variantMappingResults.loading}
          key={FilterKeys.VARIANTS}
          index={INDEXES.VARIANTS}
          queryBuilderId={VARIANT_REPO_QB_ID}
          extendedMappingResults={variantMappingResults}
          filterInfo={filterGroups[FilterTypes.Variant]}
          filterMapper={mapFilterForVariant}
        />
      ),
    });
  }
  if (getFTEnvVarByKey(FT_VARIANT_FACET_GENE) !== 'false') {
    menuItems.push({
      key: '3',
      title: intl.get('screen.variants.sidemenu.gene'),
      icon: <GeneIcon className={styles.sideMenuIcon} />,
      panelContent: (
        <FilterList
          loading={variantMappingResults.loading}
          key={FilterKeys.GENES}
          index={INDEXES.VARIANTS}
          queryBuilderId={VARIANT_REPO_QB_ID}
          extendedMappingResults={variantMappingResults}
          filterInfo={filterGroups[FilterTypes.Gene]}
          filterMapper={mapFilterForVariant}
        />
      ),
    });
  }
  if (getFTEnvVarByKey(FT_VARIANT_FACET_PATHOGENICITY) !== 'false') {
    menuItems.push({
      key: '4',
      title: intl.get('screen.variants.sidemenu.pathogenicity'),
      icon: <DiseaseIcon className={styles.sideMenuIcon} />,
      panelContent: (
        <FilterList
          loading={variantMappingResults.loading}
          key={FilterKeys.PATHOGENICITY}
          index={INDEXES.VARIANTS}
          queryBuilderId={VARIANT_REPO_QB_ID}
          extendedMappingResults={variantMappingResults}
          filterInfo={filterGroups[FilterTypes.Pathogenicity]}
          filterMapper={mapFilterForVariant}
        />
      ),
    });
  }
  if (getFTEnvVarByKey(FT_VARIANT_FACET_FREQUENTY) !== 'false') {
    menuItems.push({
      key: '5',
      title: intl.get('screen.variants.sidemenu.frequency'),
      icon: <FrequencyIcon className={styles.sideMenuIcon} />,
      panelContent: (
        <FilterList
          loading={variantMappingResults.loading}
          key={FilterKeys.FREQUENCY}
          index={INDEXES.VARIANTS}
          queryBuilderId={VARIANT_REPO_QB_ID}
          extendedMappingResults={variantMappingResults}
          filterInfo={filterGroups[FilterTypes.Frequency]}
          filterMapper={mapFilterForVariant}
        />
      ),
    });
  }

  return (
    <div className={styles.variantsLayout}>
      <SidebarMenu className={styles.sideMenu} menuItems={menuItems} />
      <ScrollContent id={SCROLL_WRAPPER_ID} className={styles.scrollContent}>
        <PageContent
          variantMapping={{
            data: [],
            loading: false,
          }}
          tabId={tab}
        />
      </ScrollContent>
    </div>
  );
};

export default Variants;
