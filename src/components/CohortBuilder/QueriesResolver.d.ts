import { Component } from 'react';

//Function as Child Component (FaCC) : <Element>{(params) => {...}}<Element/>
export type QueriesResolverFaCCType = {
  isLoading: Boolean;
  data: Object;
  error?: Object;
};

type Query = {
  query: Object | string;
  variables: Object;
  transform?: Function;
};

export type Queries = Array<Query>;

type Props = {
  api: Function;
  queries: Queries;
  switchLoadingState?: Boolean;
  useCache?: Boolean;
  name?: string;
};

type State = {
  data: Array;
  isLoading: Boolean;
  error?: Object;
};

declare class QueriesResolver extends Component<Props, State> {}
export default QueriesResolver;
