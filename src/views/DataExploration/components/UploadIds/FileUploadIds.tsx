import intl from 'react-intl-universal';
import { updateActiveQueryField } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { BooleanOperators } from '@ferlab/ui/core/data/sqon/operators';
import { MERGE_VALUES_STRATEGIES } from '@ferlab/ui/core/data/sqon/types';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { INDEXES } from 'graphql/constants';
import { hydrateResults } from 'graphql/models';
import { ArrangerApi } from 'services/api/arranger';
import EntityUploadIds from './EntityUploadIds';
import { IFileEntity } from 'graphql/files/models';
import { CHECK_FILE_MATCH } from 'graphql/files/queries';

interface OwnProps {
  queryBuilderId: string;
}

const FileUploadIds = ({ queryBuilderId }: OwnProps) => (
  <EntityUploadIds
    entityId="file"
    entityIdTrans="File"
    entityIdentifiers="File ID"
    placeHolder="e.g. GF_001CSF26, HTP.007855d5-e22e-405f-91f4-d54b4b8a9136.g.vcf.gz"
    fetchMatch={async (ids) => {
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

      const files: IFileEntity[] = hydrateResults(response.data?.data?.file?.hits?.edges || []);

      return files.map((file) => ({
        key: file.fhir_id,
        submittedId: ids.find((id) => [file.file_id].includes(id))!,
        mappedTo: file.study.study_id,
        matchTo: file.file_id,
      }));
    }}
    onUpload={(match) =>
      updateActiveQueryField({
        queryBuilderId,
        field: 'file_facet_ids.file_fhir_id_2',
        value: match.map((value) => value.key),
        index: INDEXES.FILE,
        overrideValuesName: intl.get('components.uploadIds.modal.pillTitle'),
        merge_strategy: MERGE_VALUES_STRATEGIES.OVERRIDE_VALUES,
      })
    }
  />
);

export default FileUploadIds;
