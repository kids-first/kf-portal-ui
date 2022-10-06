import {
  ISqonGroupFilter,
  ISyntheticSqon,
  IValueContent,
  IValueFilter,
  TSqonContent,
} from '@ferlab/ui/core/data/sqon/types';
import { isBooleanOperator, isEmptySqon } from '@ferlab/ui/core/data/sqon/utils';
import { INDEXES } from 'graphql/constants';
import { ExtendedMapping, ExtendedMappingResults } from 'graphql/models';

interface IFieldPrefixMap {
  index: string;
  prefix: string;
}

const getPrefix = (field: IValueContent, fieldPrefixMaps: IFieldPrefixMap[]) => {
  const fieldPrefixMap = fieldPrefixMaps.find((config) => config.index === field.index);
  return fieldPrefixMap ? fieldPrefixMap.prefix : '';
};

const recursiveMap = (
  sqon: ISqonGroupFilter | IValueFilter,
  fieldPrefixMaps: IFieldPrefixMap[],
): ISqonGroupFilter => {
  if (isEmptySqon(sqon as ISyntheticSqon)) {
    return sqon as ISqonGroupFilter;
  }

  const getNewContent = (sqon: ISqonGroupFilter): TSqonContent =>
    sqon.content.map((c: any) => recursiveMap(c, fieldPrefixMaps));

  if (isBooleanOperator(sqon)) {
    return Object.assign({
      content: getNewContent(sqon as ISqonGroupFilter),
      op: sqon.op,
    });
  }

  const valueSqon = sqon as IValueFilter;

  return Object.assign({
    content: {
      ...valueSqon.content,
      field: `${getPrefix(valueSqon.content, fieldPrefixMaps)}${valueSqon.content.field}`,
    },
    op: sqon.op,
  });
};

export const mapFilterForVariant = (sqonFilters: ISqonGroupFilter) =>
  recursiveMap(sqonFilters, [
    {
      index: INDEXES.VARIANTS,
      prefix: 'variants.',
    },
  ]);

export const mapFilterForParticipant = (sqonFilters: ISqonGroupFilter) =>
  recursiveMap(sqonFilters, [
    {
      index: INDEXES.FILES,
      prefix: 'files.',
    },
    {
      index: INDEXES.BIOSPECIMENS,
      prefix: 'files.biospecimens.',
    },
  ]);

export const mapFilterForFiles = (sqonFilters: ISqonGroupFilter) =>
  recursiveMap(sqonFilters, [
    {
      index: INDEXES.FILES,
      prefix: 'files.',
    },
  ]);

export const mapFilterForBiospecimen = (sqonFilters: ISqonGroupFilter) =>
  recursiveMap(sqonFilters, [
    {
      index: INDEXES.FILES,
      prefix: 'files.',
    },
    {
      // Biospecimen only 1 participant so no 's'
      index: INDEXES.PARTICIPANT,
      prefix: 'participant.',
    },
  ]);

export const combineExtendedMappings = (mappings: ExtendedMappingResults[]) => {
  let concatMappings: ExtendedMapping[] = [];
  mappings.forEach((mapping) => {
    concatMappings = concatMappings.concat(mapping.data);
  });

  return {
    loading: false,
    data: concatMappings,
  };
};
