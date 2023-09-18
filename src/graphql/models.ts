export interface ArrangerNodeData {
  id: string;
  cid?: string;
  key?: string;
}

export type AggregationBuckets = {
  buckets: [
    {
      key: string;
      doc_count: number;
    },
  ];
  stats: string;
};

export type RawAggregation = {
  data: {
    [key: string]: {
      aggregations: Aggregations;
    };
  };
};

export type Aggregations = Record<string, AggregationBuckets>;

export interface GqlResults<DataT> {
  data: DataT[];
  aggregations: Aggregations;
  loading: boolean;
  total: number;
}

// Recursive type that can represent nested query
export interface ArrangerResultsTree<T extends ArrangerNodeData> {
  hits: ArrangerHits<T>;
}

export interface ArrangerHits<T extends ArrangerNodeData> {
  total?: number;
  edges: ArrangerEdge<T>[];
}

export type ArrangerEdge<T extends ArrangerNodeData> = {
  node: T;
};

export type ExtendedMapping = {
  active: boolean;
  displayName: string;
  isArray: boolean;
  type: string;
  field: string;
  rangeStep?: number;
};

export type ExtendedMappingResults = {
  loading: boolean;
  data: ExtendedMapping[];
};

export const hydrateResults = <resultType extends ArrangerNodeData>(
  results: ArrangerEdge<resultType>[],
): resultType[] =>
  results.map(
    (edge: ArrangerEdge<resultType>, index): resultType => ({
      ...edge.node,
      key: edge.node?.id || index,
    }),
  );

export interface IQueryResults<T> {
  data: T;
  loading: boolean;
  total: number;
}