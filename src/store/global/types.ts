import { ArgsProps as NotificationArgsProps } from 'antd/lib/notification';
import { ArgsProps as MessageArgsProps, NoticeType } from 'antd/lib/message';
import { IStatistics } from 'services/api/arranger/models';

export type MessageArgsPropsCustom = MessageArgsProps & { type: NoticeType };

export type initialState = {
  lang: string;
  notification: NotificationArgsProps | undefined;
  message: MessageArgsPropsCustom | undefined;
  messagesToDestroy: string[];
  stats?: IStatistics;
  isFetchingStats: boolean;
};
