import { ReactNode } from 'react';
import { IExtendedMappingResults } from '@ferlab/ui/core/graphql/types';
import { DocumentNode } from 'graphql';

export interface FilterGroup {
  title?: string;
  facets: string[] | ReactNode[];
  tooltips?: string[];
  noDataOption?: string[];
  intervalDecimal?: { [key: string]: number };
  categoryIcon?: ReactNode;
}

export interface FilterInfo {
  customSearches?: ReactNode[];
  defaultOpenFacets?: string[];
  groups: FilterGroup[];
}

export type TAggregationFunction = (
  index: string,
  aggList: string[],
  mappingResults: IExtendedMappingResults,
) => DocumentNode;
