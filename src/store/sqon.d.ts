type SqonFilters = {
  op: string;
  content: { field: string; value: string[] };
};

export type Sqon = {
  op: string;
  content: SqonFilters[];
};
