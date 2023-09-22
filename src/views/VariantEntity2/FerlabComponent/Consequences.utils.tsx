import { IPredictionEntity } from 'graphql/variants2/models';

export const getPredictionScore = (
  predictions: IPredictionEntity,
  dictionary: {
    sift: string;
    polyphen2: string;
    fathmm: string;
    cadd: string;
    dann: string;
    lrt: string;
    revel: string;
  },
): any[][] =>
  [
    [dictionary.sift, predictions?.sift_pred, predictions?.sift_score],
    [dictionary.polyphen2, predictions?.polyphen2_hvar_pred, predictions?.sift_score],
    [dictionary.fathmm, predictions?.fathmm_score],
    [dictionary.cadd, null, predictions?.cadd_score],
    [dictionary.dann, null, predictions?.dann_score],
    [dictionary.lrt, predictions?.lrt_pred, predictions?.lrt_score],
    [dictionary.revel, null, predictions?.revel_score],
  ].filter(([, , score]) => score);
