import { EntityTable, IEntityTable } from '@ferlab/ui/core/pages/EntityPage';
import { isExternalCohortsTableEmpty } from '@ferlab/ui/core/pages/EntityPage/utils/frequencies';
import { IExternalFrequenciesEntity } from 'graphql/variants2/models';

import { makeRowFromFrequencies } from './EntityPublicCohortTable.utils';

interface IEntityPublicCohortTable extends Omit<IEntityTable, 'data'> {
  emptyMessage: string;
  frequencies?: IExternalFrequenciesEntity;
  locus?: string;
}

export const EntityPublicCohortTable = ({
  columns,
  frequencies,
  header,
  id,
  loading,
  locus,
  ...tableProps
}: IEntityPublicCohortTable): JSX.Element => {
  let externalCohortsRows = makeRowFromFrequencies(frequencies, locus);
  const hasEmptyCohorts = isExternalCohortsTableEmpty(externalCohortsRows);

  if (!loading && hasEmptyCohorts) {
    externalCohortsRows = [];
  }

  return (
    <EntityTable
      {...tableProps}
      columns={columns}
      data={externalCohortsRows}
      header={header}
      id={id}
      loading={loading}
    />
  );
};

export default EntityPublicCohortTable;
