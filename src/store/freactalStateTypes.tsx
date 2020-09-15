// To fill up when needed (from freactal providers)
import { LoggedInUser } from './userTypes';

type Effects = {
  setUser: Function;
  setToken: Function;
  clearIntegrationTokens: Function;
};

type State = {
  loggedInUser: LoggedInUser;
  isLoadingUser: boolean;
};

export type InjectStateProps = {
  effects: Effects;
  state: State;
};
