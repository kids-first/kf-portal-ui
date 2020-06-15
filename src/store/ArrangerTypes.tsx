export type AggState = {
  field: string;
  type: string;
  show: boolean;
  active?: boolean;
};

export type AggsState = {
  state: [AggState];
};
