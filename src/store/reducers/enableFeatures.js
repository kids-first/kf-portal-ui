import { ENABLE_FEATURE } from '../actionTypes';

const initialState = {
  enableFeatures: [],
};

export default (state = initialState, action) => {
  if (action.type === ENABLE_FEATURE) {
    return { ...initialState };
  } else {
    return state;
  }
};
