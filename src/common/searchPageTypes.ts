import { TSortDirection } from 'graphql/queries';

export type TPagingConfig = {
  index: number;
  size: number;
};

export type TPagingConfigCb = (config: TPagingConfig) => void;

export type TQueryConfigCb = (config: IQueryConfig) => void;

export interface IQueryConfig {
  pageIndex: number;
  size: number;
  sort: {
    field: string;
    order: TSortDirection;
  }[];
}
