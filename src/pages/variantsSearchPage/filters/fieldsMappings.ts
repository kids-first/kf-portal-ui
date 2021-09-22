export const fieldMappings: FieldMappings = {
  consequences__predictions__sift_pred: { T: 'Tolerated', D: 'Damaging' },
  consequences__predictions__polyphen2_hvar_pred: {
    B: 'Benign',
    D: 'Probably Damaging',
    P: 'Possibly Damaging',
  },
  consequences__predictions__fathmm_pred: { T: 'Tolerated', D: 'Damaging' },
  consequences__predictions__lrt_pred: { N: 'Neutral', D: 'Deleterious', U: 'Unknown' },
  zygosity: { HET: 'Heterozygote', WT: 'Wild Type', HOM: 'Homozygote', UNK: 'Unknown' },
};

interface FieldMappings {
  [field: string]: FieldConversion;
}

interface FieldConversion {
  [key: string]: string;
}
