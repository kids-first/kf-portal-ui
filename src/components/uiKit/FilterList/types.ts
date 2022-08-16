import { DocumentNode } from 'graphql';
import { ExtendedMappingResults } from 'graphql/models';
import React from 'react';

export interface FilterGroup {
  title?: string;
  facets: string[] | React.ReactNode[];
}

export interface FilterInfo {
  customSearches?: React.ReactNode[];
  defaultOpenFacets?: string[];
  groups: FilterGroup[];
}

export type TAggregationFunction = (
  index: string,
  aggList: string[],
  mappingResults: ExtendedMappingResults,
) => DocumentNode;
