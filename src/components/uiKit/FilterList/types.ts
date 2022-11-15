import { IExtendedMappingResults } from '@ferlab/ui/core/graphql/types';
import { DocumentNode } from 'graphql';
import React from 'react';

export interface FilterGroup {
  title?: string;
  facets: string[] | React.ReactNode[];
  tooltips?: string[];
}

export interface FilterInfo {
  customSearches?: React.ReactNode[];
  defaultOpenFacets?: string[];
  groups: FilterGroup[];
}

export type TAggregationFunction = (
  index: string,
  aggList: string[],
  mappingResults: IExtendedMappingResults,
) => DocumentNode;
