import { useSelector } from 'react-redux';
import { remoteSelector } from './selector';
import { RemoteComponentList } from './types';

export type { initialState as RemoteInitialState } from './types';
export { default, RemoteState } from './slice';

export const useRemote = (id: RemoteComponentList) => {
  const remoteState = useSelector(remoteSelector);

  return remoteState[id];
};
