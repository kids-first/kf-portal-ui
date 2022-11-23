import intl from 'react-intl-universal';
import { updateActiveQueryField } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import UploadIds from '@ferlab/ui/core/components/UploadIds';
import { MatchTableItem } from '@ferlab/ui/core/components/UploadIds/types';
import { BooleanOperators } from '@ferlab/ui/core/data/sqon/operators';
import { MERGE_VALUES_STRATEGIES } from '@ferlab/ui/core/data/sqon/types';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { hydrateResults } from '@ferlab/ui/core/graphql/utils';
import { Descriptions } from 'antd';
import { INDEXES } from 'graphql/constants';
import { CHECK_GENE_MATCH_QUERY } from 'graphql/genes/queries';
import { IGeneEntity } from 'graphql/variants/models';

import { ArrangerApi } from 'services/api/arranger';

import styles from './index.module.scss';

interface OwnProps {
  queryBuilderId: string;
}

const GenesUploadIds = ({ queryBuilderId }: OwnProps) => (
  <UploadIds
    dictionary={{
      modalTitle: intl.get('upload.gene.ids.modal.title'),
      submittedColTitle: intl.get('upload.gene.ids.modal.submittedColTitle'),
      uploadBtnText: intl.get('upload.gene.ids.modal.uploadBtnText'),
      modalUploadBtnText: intl.get('upload.gene.ids.modal.upload.file.btn'),
      mappedTo: intl.get('upload.gene.ids.modal.mappedTo'),
      clear: intl.get('upload.gene.ids.modal.clear.btn'),
      emptyTableDescription: intl.get('upload.gene.ids.modal.empty.table'),
      modalOkText: intl.get('upload.gene.ids.modal.upload.btn'),
      modalCancelText: intl.get('upload.gene.ids.modal.cancel.btn'),
      collapseTitle: (matchCount, unMatchCount) =>
        intl.get('upload.gene.ids.modal.collapseTitle', {
          matchCount,
          unMatchCount,
        }),
      matchTabTitle: (matchCount) => intl.get('upload.gene.ids.modal.match', { count: matchCount }),
      unmatchTabTitle: (unmatchcount) =>
        intl.get('upload.gene.ids.modal.unmatch', { count: unmatchcount }),
      tablesMessage: (submittedCount, mappedCount) =>
        intl.get('upload.gene.ids.modal.table.message', {
          submittedCount,
          mappedCount,
        }),
      inputLabel: intl.get('upload.gene.ids.modal.input.label'),
      matchTable: {
        idColTitle: intl.get('upload.gene.ids.modal.match.table.idcol.title'),
        matchToFieldColTitle: intl.get('upload.gene.ids.modal.match.table.matchcol.title'),
        mappedToFieldColTitle: intl.get('upload.gene.ids.modal.match.table.mappedcol.title'),
      },
    }}
    popoverProps={{
      title: intl.get('components.uploadIds.modal.popover.title'),
      overlayClassName: styles.geneUploadIdsPopover,
      content: (
        <Descriptions column={1}>
          <Descriptions.Item label={intl.get('components.uploadIds.modal.popover.identifiers')}>
            {intl.get('upload.gene.ids.modal.identifiers')}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.get('components.uploadIds.modal.popover.separatedBy.title')}
          >
            {intl.get('components.uploadIds.modal.popover.separatedBy.values')}
          </Descriptions.Item>
          <Descriptions.Item
            label={intl.get('components.uploadIds.modal.popover.uploadFileFormats')}
          >
            {intl.get('components.uploadIds.modal.popover.fileFormats')}
          </Descriptions.Item>
        </Descriptions>
      ),
    }}
    placeHolder="ex. ENSG00000157764, TP53"
    fetchMatch={async (ids) => {
      const response = await ArrangerApi.graphqlRequest({
        query: CHECK_GENE_MATCH_QUERY.loc?.source.body,
        variables: {
          first: 1000,
          offset: 0,
          sqon: generateQuery({
            operator: BooleanOperators.or,
            newFilters: ['symbol', 'ensembl_gene_id', 'alias'].map((field) =>
              generateValueFilter({
                field,
                value: ids,
                index: INDEXES.GENES,
              }),
            ),
          }),
        },
      });

      const genes: IGeneEntity[] = hydrateResults(response.data?.data?.genes?.hits?.edges || []);

      const matchResults = ids.map((id, index) => {
        const gene = genes.find((gene) =>
          [gene.symbol, gene.ensembl_gene_id, gene.alias].flat().includes(id),
        );

        return gene
          ? {
              key: index.toString(),
              submittedId: id,
              mappedTo: gene.symbol,
              matchTo: gene.ensembl_gene_id,
            }
          : undefined;
      });

      return matchResults.filter((x) => !!x) as MatchTableItem[];
    }}
    onUpload={(match) =>
      updateActiveQueryField({
        queryBuilderId,
        field: 'consequences.symbol',
        value: match.map((value) => value.mappedTo),
        index: INDEXES.VARIANTS,
        merge_strategy: MERGE_VALUES_STRATEGIES.APPEND_VALUES,
      })
    }
  />
);

export default GenesUploadIds;
