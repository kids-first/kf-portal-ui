import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import { IParticipantPhenotype } from 'graphql/participants/models';

export const dataFileDefaultColumns: ProColumnType[] = [
  {
    key: 'hpo_phenotype_observed',
    title: 'Phenotype (HPO)',
    render: (phenotype: IParticipantPhenotype) =>
      phenotype?.hpo_phenotype_observed || TABLE_EMPTY_PLACE_HOLDER,
  },
];
