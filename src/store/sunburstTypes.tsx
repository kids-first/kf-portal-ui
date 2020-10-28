export type Phenotype = {
  title: string;
  results: number;
  exactTagCount: number;
  key: string;
  text: string;
  children: Array<Phenotype>;
  name: string;
  depth: number;
  disabled: boolean;
  valueText: string;
};

export const generateEmptyPhenotype = () => ({
  title: 'No Data',
  children: [],
  results: 0,
  exactTagCount: 0,
  key: 'no-data',
  text: '',
  name: '',
  depth: 0,
  disabled: true,
  valueText: '',
});
