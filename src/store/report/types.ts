import { ProColumnType, TColumnStates } from '@ferlab/ui/core/components/ProTable/types';

export type Message = {
  content: string;
  duration: number;
  type: MessageType;
};

export enum MessageType {
  INFO = 'info',
  WARN = 'warning',
  LOADING = 'loading',
}

export type initialState = {
  isLoading: boolean;
  error?: any;
};

export type TFetchTSVArgs = {
  index: string;
  columnStates: TColumnStates | undefined;
  columns: ProColumnType[];
  sqon: any;
};
