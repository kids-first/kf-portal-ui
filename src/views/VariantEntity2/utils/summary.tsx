import { IVariantEntity } from 'graphql/variants/models';

export const getSummaryItems = (variant?: IVariantEntity) => {
  return [
    {
      title: '',
      value: '',
    },
  ];
};
