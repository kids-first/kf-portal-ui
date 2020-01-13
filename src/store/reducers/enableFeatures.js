import { ENABLE_FEATURE } from '../actionTypes';

const initialState = {
  enableFeatures: {},
};

export default (state = initialState, action) => {
  if (action.type === ENABLE_FEATURE) {
    const objectArray = Object.entries(action.payload);

    const oldEnablerF = {...state.enableFeatures};

    objectArray.forEach(([key, value], index) => {
      oldEnablerF[key.toUpperCase()] = value.toLowerCase() === "true"
    });

    return {
      ...state,
      enableFeatures: oldEnablerF,
    };
  } else {
    return state;
  }
};