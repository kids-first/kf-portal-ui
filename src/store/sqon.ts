export type SqonContent = { field: string; value: string[] | string };

export type SqonFilters = {
  op: string;
  content: SqonContent;
};

export type Sqon = {
  op: string;
  content: Sqon[] | SqonFilters[];
};

export const isSqonFilter = (sqon: Sqon | SqonFilters) => (sqon as SqonFilters).content.field;

export type setSqonArrangerCB = (s?: Sqon | null) => void;
