export enum Impact {
  High = 'HIGH',
  Moderate = 'MODERATE',
  Low = 'LOW',
  Modifier = 'MODIFIER',
}

export type Consequence = {
  symbols: string[];
  consequences: string[];
  impact: Impact;
  canonical: boolean;
  [key: string]: any;
};

export type VariantTableResult = {
  [key: string]: any;
};
