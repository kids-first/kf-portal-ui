import { ISetOperation, ISummaryData } from '@ferlab/ui/core/components/Charts/Venn';
import { INDEXES } from 'graphql/constants';

export type initialState = {
  index: INDEXES;
  summary: ISummaryData[];
  operations: ISetOperation[];
  loading?: boolean;
  error?: boolean;
};
