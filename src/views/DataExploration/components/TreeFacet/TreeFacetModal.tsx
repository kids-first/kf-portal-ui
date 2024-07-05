import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import OntologyTreeModal from '@ferlab/ui/core/components/OntologyTreeFilter';
import { IOntologyTreeData } from '@ferlab/ui/core/components/OntologyTreeFilter/type';
import { updateActiveQueryField } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { TermOperators } from '@ferlab/ui/core/data/sqon/operators';
import { MERGE_VALUES_STRATEGIES } from '@ferlab/ui/core/data/sqon/types';
import { removeFieldFromSqon } from '@ferlab/ui/core/data/sqon/utils';

import { RemoteComponentList } from 'store/remote/types';

import { INDEXES } from '../../../../graphql/constants';
import useParticipantResolvedSqon from '../../../../graphql/participants/useParticipantResolvedSqon';
import EnvironmentVariables from '../../../../helpers/EnvVariables';
import useApi from '../../../../hooks/useApi';
import { useRemote } from '../../../../store/remote';
import { remoteSliceActions } from '../../../../store/remote/slice';
import { DATA_EXPLORATION_QB_ID } from '../../utils/constant';

const ARRANGER_API_URL = EnvironmentVariables.configFor('ARRANGER_API');
const ARRANGER_PROJECT_ID = EnvironmentVariables.configFor('ARRANGER_PROJECT_ID');

type Props = {
  type: RemoteComponentList;
  field: string;
};

const TreeFacetModal = ({ type, field }: Props) => {
  const dispatch = useDispatch();
  const { sqon } = useParticipantResolvedSqon(DATA_EXPLORATION_QB_ID);
  const { visible } = useRemote(type);

  // send empty sqon to always get all phenotypes/diagnoses
  const { loading, result } = useApi<any>({
    config: {
      url: `${ARRANGER_API_URL}/phenotypes`,
      method: 'POST',
      data: {
        type: field,
        project: ARRANGER_PROJECT_ID,
        aggregations_filter_themselves: false,
        sqon: removeFieldFromSqon(`${field}.name`, sqon),
      },
    },
  });

  return (
    <OntologyTreeModal
      handleCancel={() => {
        dispatch(
          remoteSliceActions.openRemoteComponent({
            id: type,
            props: {
              visible: false,
            },
          }),
        );
      }}
      handleOnApply={(value: string[], operator: TermOperators = TermOperators.in) => {
        if (value?.length > 0) {
          updateActiveQueryField({
            queryBuilderId: DATA_EXPLORATION_QB_ID,
            field: `${field}.name`,
            value,
            operator,
            index: INDEXES.PARTICIPANT,
            merge_strategy: MERGE_VALUES_STRATEGIES.OVERRIDE_VALUES,
            remoteComponent: {
              id: type,
              props: {
                visible: true,
                field,
              },
            },
          });
        } else {
          updateActiveQueryField({
            queryBuilderId: DATA_EXPLORATION_QB_ID,
            field: `${field}.name`,
            value: [],
            remoteComponent: {
              id: type,
              props: {
                visible: true,
                field,
              },
            },
          });
        }

        dispatch(
          remoteSliceActions.openRemoteComponent({
            id: type,
            props: {
              visible: false,
            },
          }),
        );
      }}
      data={(result?.data as IOntologyTreeData[]) ?? []}
      sqon={sqon}
      field={field}
      open={visible}
      loading={loading}
      dictionary={{
        cancelText: intl.get('global.cancel'),
        okText: intl.get(`screen.dataExploration.${type}.modal.okText`),
        title: intl.get(`screen.dataExploration.${type}.modal.title`),
        allOf: intl.get('screen.dataExploration.allOf'),
        anyOf: intl.get('screen.dataExploration.anyOf'),
        noneOf: intl.get('screen.dataExploration.noneOf'),
        tree: {
          participantsWithExactTermTooltip: intl.get(`screen.dataExploration.${type}.tags.exact`),
          participantsCountTooltip: intl.get(`screen.dataExploration.${type}.tags.all`),
          searchPlaceholder: intl.get(`screen.dataExploration.${type}.searchPlaceholder`),
          emptySelection: intl.get(`screen.dataExploration.${type}.emptySelection`),
          selectedCount: (count: number) =>
            intl.get(`screen.dataExploration.${type}.selectedCount`, { count }),
          matchingCount: (count: number) =>
            intl.get(`screen.dataExploration.${type}.selectedCount`, { count }),
        },
      }}
    />
  );
};

export default TreeFacetModal;
