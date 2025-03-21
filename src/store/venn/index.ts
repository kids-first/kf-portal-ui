export type { initialState as VennInitialState } from './types';

import { useSelector } from 'react-redux';

import { vennSelector } from './selector';

export { default, VennState } from './slice';

export const useVennData = () => useSelector(vennSelector);
