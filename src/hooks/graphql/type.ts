import { ApolloError } from "@apollo/client";

export interface IBaseQueryResults<TData> {
  error: ApolloError | undefined;
  result: TData | undefined;
  loading: boolean;
}
