import intl from 'react-intl-universal';
import { updateActiveQueryField } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { BooleanOperators } from '@ferlab/ui/core/data/sqon/operators';
import { MERGE_VALUES_STRATEGIES } from '@ferlab/ui/core/data/sqon/types';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { INDEXES } from 'graphql/constants';
import { hydrateResults } from 'graphql/models';
import { IParticipantEntity } from 'graphql/participants/models';
import { ArrangerApi } from 'services/api/arranger';
import { CHECK_PARTICIPANT_MATCH } from 'graphql/participants/queries';
import EntityUploadIds from './EntityUploadIds';

interface OwnProps {
  queryBuilderId: string;
}

const ParticipantUploadIds = ({ queryBuilderId }: OwnProps) => (
  <EntityUploadIds
    entityId="participant"
    entityIdTrans="Participant"
    entityIdentifiers="Participant ID"
    placeHolder="e.g. PT_03Y3K025, HTP0001, 10214"
    fetchMatch={async (ids) => {
      const response = await ArrangerApi.graphqlRequest({
        query: CHECK_PARTICIPANT_MATCH.loc?.source.body,
        variables: {
          first: 10000,
          offset: 0,
          sqon: generateQuery({
            operator: BooleanOperators.or,
            newFilters: ['participant_id'].map((field) =>
              generateValueFilter({
                field,
                value: ids,
                index: INDEXES.PARTICIPANT,
              }),
            ),
          }),
        },
      });

      const participants: IParticipantEntity[] = hydrateResults(
        response.data?.data?.participant?.hits?.edges || [],
      );

      return participants.map((participant) => ({
        key: participant.fhir_id,
        submittedId: ids.find((id) =>
          [participant.participant_id].includes(id),
        )!,
        mappedTo: participant.study_id,
        matchTo: participant.participant_id,
      }));
    }}
    onUpload={(match) =>
      updateActiveQueryField({
        queryBuilderId,
        field: 'participant_facet_ids.participant_fhir_id_2',
        value: match.map((value) => value.key),
        index: INDEXES.PARTICIPANT,
        overrideValuesName: intl.get('components.uploadIds.modal.pillTitle'),
        merge_strategy: MERGE_VALUES_STRATEGIES.OVERRIDE_VALUES,
      })
    }
  />
);

export default ParticipantUploadIds;
