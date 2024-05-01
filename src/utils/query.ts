import { ISyntheticSqon } from '@ferlab/ui/core/data/sqon/types';
import { isReference, resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import { IExtendedMappingResults } from '@ferlab/ui/core/graphql/types';

const queryListContainsAllReferences = (queryList: ISyntheticSqon[], query: ISyntheticSqon) => {
  const refIndexes = query?.content?.filter((e) => isReference(e)).map((e) => e as number);
  return refIndexes?.every((refIndex) => queryList?.[refIndex]?.content?.length > 0);
};

export const EMPTY_QUERY = { op: '', content: [] };

/*
Due to random async delay between queries saved inside local storage and react hook noticing,
check if the references are here before asking Ferlab UI.
*/
export const resolveSyntheticSqonWithReferences = (
  queryList: ISyntheticSqon[],
  query: ISyntheticSqon,
  extendedMapping?: IExtendedMappingResults,
) =>
  queryListContainsAllReferences(queryList, query)
    ? resolveSyntheticSqon(queryList, query, extendedMapping)
    : EMPTY_QUERY;
