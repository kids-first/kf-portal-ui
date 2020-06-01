export type SqonFilters = {
  op: string;
  content: { field: string; value: string[] };
};

export type Sqon = {
  op: string;
  content: Sqon[] | SqonFilters[];
};

export const isSqonFilter = (sqon: Sqon | SqonFilters) => (sqon as SqonFilters).content.field;
