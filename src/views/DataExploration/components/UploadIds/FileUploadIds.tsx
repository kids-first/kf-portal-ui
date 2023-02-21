import intl from 'react-intl-universal';
import { updateActiveQueryField } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { MatchTableItem } from '@ferlab/ui/core/components/UploadIds/types';
import { BooleanOperators } from '@ferlab/ui/core/data/sqon/operators';
import { MERGE_VALUES_STRATEGIES } from '@ferlab/ui/core/data/sqon/types';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { hydrateResults } from '@ferlab/ui/core/graphql/utils';
import { INDEXES } from 'graphql/constants';
import { IFileEntity } from 'graphql/files/models';
import { CHECK_FILE_MATCH } from 'graphql/files/queries';

import { ArrangerApi } from 'services/api/arranger';

import EntityUploadIds from './EntityUploadIds';

interface OwnProps {
  queryBuilderId: string;
}

const FileUploadIds = ({ queryBuilderId }: OwnProps) => (
  <EntityUploadIds
    entityId="file"
    entityIdTrans="file"
    entityIdentifiers="File ID"
    placeHolder="e.g. GF_2JAYWYDX, GF_TP6PG8Z0"
    fetchMatch={async (ids: string[]) => {
      const response = await ArrangerApi.graphqlRequest({
        query: CHECK_FILE_MATCH.loc?.source.body,
        variables: {
          first: 10000,
          offset: 0,
          sqon: generateQuery({
            operator: BooleanOperators.or,
            newFilters: ['file_id'].map((field) =>
              generateValueFilter({
                field,
                value: ids,
                index: INDEXES.PARTICIPANT,
              }),
            ),
          }),
        },
      });

      const files: IFileEntity[] = hydrateResults(response.data?.data?.files?.hits?.edges || []);

      return files?.flatMap((file) => {
        const matchedIds: string[] = ids.filter(
          (id: string) => file.file_id.toLocaleLowerCase() === id.toLocaleLowerCase(),
        );

        return matchedIds.map((id, index) => ({
          key: `${file.fhir_id}:${index}`,
          submittedId: id,
          mappedTo: file.study.study_id,
          matchTo: file.file_id,
          value: file.fhir_id,
        }));
      });
    }}
    onUpload={(matches: MatchTableItem[]) =>
      updateActiveQueryField({
        queryBuilderId,
        field: 'file_facet_ids.file_fhir_id_2',
        value: matches.map((match) => match.value!),
        index: INDEXES.FILES,
        overrideValuesName: intl.get('components.uploadIds.modal.pillTitle'),
        merge_strategy: MERGE_VALUES_STRATEGIES.OVERRIDE_VALUES,
        isUploadedList: true,
      })
    }
  />
);

export default FileUploadIds;
