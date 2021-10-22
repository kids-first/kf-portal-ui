import { RangeOperators } from '@ferlab/ui/core/data/sqon/operators';

export const fieldMappings: FieldMappings = {
  'consequences.predictions.sift_pred': { T: 'Tolerated', D: 'Damaging' },
  'consequences.predictions.polyphen2_hvar_pred': {
    B: 'Benign',
    D: 'Probably Damaging',
    P: 'Possibly Damaging',
  },
  'consequences.predictions.fathmm_pred': { T: 'Tolerated', D: 'Damaging' },
  'consequences.predictions.lrt_pred': { N: 'Neutral', D: 'Deleterious', U: 'Unknown' },
  zygosity: { HET: 'Heterozygote', WT: 'Wild Type', HOM: 'Homozygote', UNK: 'Unknown' },
};

export const defaultOperatorMapping: IDefaultOpMappings = {
  start: RangeOperators.between,
  'consequences.predictions.cadd_rankscore': RangeOperators['>'],
  'consequences.predictions.dann_rankscore': RangeOperators['>'],
  'consequences.predictions.revel_rankscore': RangeOperators['>'],
};

interface IDefaultOpMappings {
  [field: string]: RangeOperators;
}

interface FieldMappings {
  [field: string]: FieldConversion;
}

interface FieldConversion {
  [key: string]: string;
}
