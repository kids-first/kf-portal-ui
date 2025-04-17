import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { ExperimentOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons';
import VennChartWithFilters from '@ferlab/ui/core/components/Charts/Venn/VennChartWithFilters';
import { TExtendedMapping } from '@ferlab/ui/core/components/filters/types';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { ISqonGroupFilter, ISyntheticSqon, SET_ID_PREFIX } from '@ferlab/ui/core/data/sqon/types';
import {
  generateQuery,
  generateValueFilter,
  resolveSyntheticSqon,
} from '@ferlab/ui/core/data/sqon/utils';
import PageHeader from '@ferlab/ui/core/layout/PageHeader';
import { INDEXES } from 'graphql/constants';
import {
  BIOSPECIMENS_SAVED_SETS_FIELD,
  DATA_EXPLORATION_QB_ID,
  TAB_IDS,
} from 'views/DataExploration/utils/constant';
import { VARIANT_REPO_QB_ID, VARIANT_SAVED_SETS_FIELD } from 'views/Variants/utils/constants';
import {
  VARIANT_SOMATIC_REPO_QB_ID,
  VARIANT_SOMATIC_SAVED_SETS_FIELD,
} from 'views/VariantsSomatic/utils/constants';

import LineStyleIcon from 'components/Icons/LineStyleIcon';
import useGetExtendedMappings from 'hooks/graphql/useGetExtendedMappings';
import {
  trackCompareSetOperations,
  trackVennClickOnSections,
  trackVennViewEntityCounts,
  trackVennViewInExploration,
  trackVennViewSet,
} from 'services/analytics';
import { SetType } from 'services/api/savedSet/models';
import { getSetFieldId, PROJECT_ID, useSavedSet } from 'store/savedSet';
import { createSavedSet } from 'store/savedSet/thunks';
import { useVennData } from 'store/venn';
import { fetchVennData } from 'store/venn/thunks';
import { combineExtendedMappings } from 'utils/fieldMapper';
import { STATIC_ROUTES } from 'utils/routes';
import { getQueryBuilderDictionary } from 'utils/translation';

import NoSet from './NoSet';
import SelectSets from './SelectSets';
import { vennDictionary } from './utils';

import styles from './index.module.css';

const getIndexBySetType = (setType?: string) => {
  switch (setType) {
    case SetType.BIOSPECIMEN:
      return INDEXES.BIOSPECIMEN;
    case SetType.FILE:
      return INDEXES.FILE;
    case SetType.VARIANT:
      return INDEXES.VARIANTS;
    case SetType.SOMATIC:
      return INDEXES.VARIANTS_SOMATIC;
    default:
    case SetType.PARTICIPANT:
      return INDEXES.PARTICIPANT;
  }
};

const getIdField = (setType: string) => {
  switch (setType) {
    case INDEXES.BIOSPECIMEN:
      return BIOSPECIMENS_SAVED_SETS_FIELD;
    case INDEXES.VARIANTS:
      return VARIANT_SAVED_SETS_FIELD;
    case INDEXES.VARIANTS_SOMATIC:
      return VARIANT_SOMATIC_SAVED_SETS_FIELD;
    default:
      return 'fhir_id';
  }
};

const SetOperations = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const [hasSets, setHasSets] = useState<boolean>(false);
  const [compareSets, setCompareSets] = useState<boolean>(false);
  const { savedSets } = useSavedSet();
  const vennData = useVennData();

  const [entitySelected, setEntitySelected] = useState<SetType | undefined>(undefined);
  const [setIdsSelected, setSetIdsSelected] = useState<string[]>([]);

  const participantMapping = useGetExtendedMappings(INDEXES.PARTICIPANT);
  const biospecimenMapping = useGetExtendedMappings(INDEXES.BIOSPECIMEN);
  const fileMapping = useGetExtendedMappings(INDEXES.FILE);
  const variantMapping = useGetExtendedMappings(INDEXES.VARIANTS);

  const participantSets = savedSets.filter(
    (savedSet) => savedSet.setType === SetType.PARTICIPANT && !savedSet.is_invisible,
  );
  const biospecimenSets = savedSets.filter(
    (savedSet) => savedSet.setType === SetType.BIOSPECIMEN && !savedSet.is_invisible,
  );
  const fileSets = savedSets.filter(
    (savedSet) => savedSet.setType === SetType.FILE && !savedSet.is_invisible,
  );
  const variantSets = savedSets.filter(
    (savedSet) => savedSet.setType === SetType.VARIANT && !savedSet.is_invisible,
  );
  const variantSomaticSets = savedSets.filter(
    (savedSet) => savedSet.setType === SetType.SOMATIC && !savedSet.is_invisible,
  );

  const handleCompare = (setIdsSelected: string[], entity: string) => {
    trackCompareSetOperations();
    const sets = savedSets.filter((set) => setIdsSelected.includes(set.id));
    const queries: ISyntheticSqon[] = [];
    sets.forEach((set) => {
      const setValue = `${SET_ID_PREFIX}${set.id}`;
      queries.push(
        generateQuery({
          newFilters: [
            generateValueFilter({
              field: getSetFieldId(set.setType),
              value: [setValue],
              index: set.setType,
            }),
          ],
        }),
      );
    });
    dispatch(fetchVennData({ qbSqons: queries, index: getIndexBySetType(entity) }));
  };

  useEffect(() => {
    if (
      participantSets.length > 1 ||
      biospecimenSets.length > 1 ||
      fileSets.length > 1 ||
      variantSets.length > 1 ||
      variantSomaticSets.length > 1
    ) {
      setHasSets(true);
    }
  }, [
    biospecimenSets.length,
    fileSets.length,
    participantSets.length,
    savedSets,
    variantSets.length,
    variantSomaticSets.length,
  ]);

  const entityOptions = [
    {
      value: SetType.PARTICIPANT,
      label: intl.get('screen.analytics.setOperations.selectSet.entityType.participants'),
      icon: <UserOutlined />,
      disabled: participantSets?.length < 2,
    },
    {
      value: SetType.BIOSPECIMEN,
      label: intl.get('screen.analytics.setOperations.selectSet.entityType.biospecimens'),
      icon: <ExperimentOutlined />,
      disabled: biospecimenSets?.length < 2,
    },
    {
      value: SetType.FILE,
      label: intl.get('screen.analytics.setOperations.selectSet.entityType.files'),
      icon: <FileTextOutlined />,
      disabled: fileSets?.length < 2,
    },
    {
      value: SetType.VARIANT,
      label: intl.get('screen.analytics.setOperations.selectSet.entityType.variantsGermline'),
      icon: <LineStyleIcon />,
      disabled: variantSets?.length < 2,
    },
    {
      value: SetType.SOMATIC,
      label: intl.get('screen.analytics.setOperations.selectSet.entityType.variantsSomatic'),
      icon: <LineStyleIcon />,
      disabled: variantSomaticSets?.length < 2,
    },
  ];

  const facetTransResolver = (key: string) => {
    const title = intl.get(`facets.${key}`);
    return title
      ? title
      : combineExtendedMappings([
          participantMapping,
          fileMapping,
          biospecimenMapping,
          variantMapping,
        ])?.data?.find((mapping: TExtendedMapping) => key === mapping.field)?.displayName || key;
  };

  return (
    <>
      <PageHeader
        onBackButton={() => navigate(STATIC_ROUTES.ANALYTICS)}
        title={<>{intl.get('screen.analytics.setOperations.title')}</>}
      />
      <div className={styles.contentWrapper}>
        {!compareSets && (
          <div className={styles.content}>
            {!hasSets && <NoSet />}
            {hasSets && (
              <SelectSets
                biospecimenSets={biospecimenSets}
                entityOptions={entityOptions}
                entitySelected={entitySelected}
                fileSets={fileSets}
                handleCompare={() => {
                  setCompareSets(true);
                  handleCompare(setIdsSelected, entitySelected || SetType.PARTICIPANT);
                }}
                participantSets={participantSets}
                setEntitySelected={(value: SetType | undefined) => setEntitySelected(value)}
                setIdsSelected={setIdsSelected}
                setSetIdsSelected={(value: string[]) => setSetIdsSelected(value)}
                variantSets={variantSets}
                variantSomaticSets={variantSomaticSets}
              />
            )}
          </div>
        )}
        {compareSets && (
          <div>
            <VennChartWithFilters
              analytics={{
                trackVennViewInExploration,
                trackVennClickOnSections,
                trackVennViewSet,
                trackVennViewEntityCounts,
              }}
              dictionary={vennDictionary}
              entityOptions={entityOptions}
              entitySelected={entitySelected || SetType.PARTICIPANT}
              error={vennData.error}
              handleCompare={handleCompare}
              handleSubmit={async ({ index, name, sets, invisible, callback }) => {
                const sqons: ISyntheticSqon[] = sets.map((set) => set.entitySqon);
                const sqonGroupFilter: ISqonGroupFilter = { op: 'or', content: [] };
                sets.forEach((set) => {
                  sqonGroupFilter.content.push(resolveSyntheticSqon(sqons, set.entitySqon));
                });
                const qbId = (() => {
                  switch (index) {
                    case INDEXES.VARIANTS:
                      return VARIANT_REPO_QB_ID;
                    case INDEXES.VARIANTS_SOMATIC:
                      return VARIANT_SOMATIC_REPO_QB_ID;
                    default:
                      return DATA_EXPLORATION_QB_ID;
                  }
                })();

                await dispatch(
                  createSavedSet({
                    idField: getIdField(index),
                    projectId: PROJECT_ID,
                    sort: [],
                    sqon: sqonGroupFilter,
                    tag: name,
                    type: index,
                    is_invisible: invisible,
                    onCompleteCb: (data) => {
                      callback();
                      if (!data) return;
                      const setValue = `${SET_ID_PREFIX}${data.id}`;
                      addQuery({
                        queryBuilderId: qbId,
                        query: generateQuery({
                          newFilters: [
                            generateValueFilter({
                              field: getSetFieldId(data.setType),
                              value: [setValue],
                              index: data.setType,
                            }),
                          ],
                        }),
                        setAsActive: true,
                      });
                    },
                  }),
                );

                switch (index) {
                  case INDEXES.BIOSPECIMEN:
                    navigate(
                      `${STATIC_ROUTES.DATA_EXPLORATION}/${TAB_IDS.BIOSPECIMENS}${window.location.search}`,
                    );
                    break;
                  case INDEXES.FILE:
                    navigate(
                      `${STATIC_ROUTES.DATA_EXPLORATION}/${TAB_IDS.DATA_FILES}${window.location.search}`,
                    );
                    break;
                  case INDEXES.VARIANTS:
                    navigate(`${STATIC_ROUTES.VARIANTS}/${window.location.search}`);
                    break;
                  case INDEXES.VARIANTS_SOMATIC:
                    navigate(`${STATIC_ROUTES.VARIANTS_SOMATIC}/${window.location.search}`);
                    break;
                  case INDEXES.PARTICIPANT:
                  default:
                    navigate(
                      `${STATIC_ROUTES.DATA_EXPLORATION}/${TAB_IDS.PARTICIPANTS}${window.location.search}`,
                    );
                    break;
                }
              }}
              idsSelected={setIdsSelected}
              loading={vennData.loading}
              operations={vennData.operations}
              options={[
                {
                  label: intl.get('screen.analytics.setOperations.venn.participants'),
                  value: INDEXES.PARTICIPANT,
                  tabId: TAB_IDS.PARTICIPANTS,
                  icon: <UserOutlined size={16} />,
                },
                {
                  label: intl.get('screen.analytics.setOperations.venn.biospecimens'),
                  value: INDEXES.BIOSPECIMEN,
                  tabId: TAB_IDS.BIOSPECIMENS,
                  icon: <ExperimentOutlined size={16} />,
                },
                {
                  label: intl.get('screen.analytics.setOperations.venn.files'),
                  value: INDEXES.FILE,
                  tabId: TAB_IDS.DATA_FILES,
                  icon: <FileTextOutlined size={16} />,
                },
                {
                  label: intl.get('screen.analytics.setOperations.venn.variants'),
                  value: INDEXES.VARIANTS,
                  tabId: undefined,
                  icon: <LineStyleIcon height={16} width={16} />,
                },
                {
                  label: intl.get('screen.analytics.setOperations.venn.somatics'),
                  value: INDEXES.VARIANTS_SOMATIC,
                  tabId: undefined,
                  icon: <LineStyleIcon height={16} width={16} />,
                },
              ]}
              queryPillDictionary={getQueryBuilderDictionary(facetTransResolver, savedSets)}
              savedSets={savedSets}
              size={{ width: 540, height: 498 }}
              summary={vennData.summary}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default SetOperations;
