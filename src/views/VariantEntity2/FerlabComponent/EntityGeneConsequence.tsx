import React from 'react';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { IArrangerEdge } from '@ferlab/ui/core/graphql/types';
import { hydrateResults } from '@ferlab/ui/core/graphql/utils';
import { EntityExpandableTableMultiple } from '@ferlab/ui/core/pages/EntityPage';
import { IGeneEntity } from 'graphql/variants2/models';

import EntityGeneConsequenceSubtitle from './EntityGeneConsequenceSubtitle';

export interface IEntityGeneConsequences {
  id: string;
  header: string;
  title?: string;
  loading: boolean;
  direction?: 'horizontal' | 'vertical';
  columns: ProColumnType[];
  genes?: IArrangerEdge<IGeneEntity>[];
  dictionary: {
    hideTranscript: string;
    showTranscript: (count: number) => string;
    noDataAvailable: string;
  };
}

export const EntityGeneConsequences = ({
  columns,
  dictionary,
  genes,
  header,
  id,
  loading,
  title,
}: IEntityGeneConsequences): JSX.Element => (
  <EntityExpandableTableMultiple
    dictionary={dictionary}
    direction="vertical"
    header={header}
    id={id}
    loading={loading}
    tables={
      genes?.map((gene) => ({
        columns,
        data: hydrateResults(gene?.node?.consequences?.hits?.edges || []),
        subTitle: (
          <EntityGeneConsequenceSubtitle
            gene={gene}
            dictionary={{
              gene: 'Gene',
              omim: 'Omim',
              spliceai: 'SpliceAI',
              gnomad_pli: 'gnomAD pLI',
              gnomad_loeuf: 'gnomAD LOEUF',
            }}
          />
        ),
      })) || []
    }
    title={title}
  />
);

export default EntityGeneConsequences;
