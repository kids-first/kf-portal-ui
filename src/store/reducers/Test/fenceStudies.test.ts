import { Action } from 'redux';

import { GEN3 } from 'common/constants';
import {
  addFenceStudies,
  removeFenceStudies,
  toggleIsFetchingAllFenceStudies,
} from 'store/actionCreators/fenceStudies';
import { MOCK_GEN3_STUDY_PHS_001436 } from 'store/actionCreators/Test/mockDataFence';

import { FenceStudiesState } from '../../fenceStudiesTypes';
import reducer from '../fenceStudies';

const unknownAction: Action = { type: 'NO_EXISTS' };

const initialState: FenceStudiesState = {
  fenceStudies: {},
  isFetchingAllFenceStudies: false,
};

describe('Fence Studies Reducer', () => {
  it('should return the initial state when an unknown action is used', () => {
    // @ts-ignore compilation does not allow such action, but must be tested for vanilla javascript
    expect(reducer(undefined, unknownAction)).toEqual(initialState);
  });

  it('should handle toggleIsFetchingAllFenceStudies', () => {
    expect(reducer(initialState, toggleIsFetchingAllFenceStudies(true))).toEqual({
      fenceStudies: {},
      isFetchingAllFenceStudies: true,
    });
  });

  it('should handle removeFenceStudies', () => {
    const state: FenceStudiesState = {
      fenceStudies: {
        [GEN3]: {
          authorizedStudies: [MOCK_GEN3_STUDY_PHS_001436],
        },
      },
      isFetchingAllFenceStudies: false,
    };
    expect(reducer(state, removeFenceStudies(GEN3))).toEqual({
      fenceStudies: {},
      isFetchingAllFenceStudies: false,
    });
  });

  it('should handle addFenceStudies', () => {
    const state: FenceStudiesState = {
      fenceStudies: {},
      isFetchingAllFenceStudies: false,
    };
    expect(
      reducer(
        state,
        addFenceStudies({
          [GEN3]: {
            authorizedStudies: [MOCK_GEN3_STUDY_PHS_001436],
          },
        }),
      ),
    ).toEqual({
      fenceStudies: {
        [GEN3]: {
          authorizedStudies: [MOCK_GEN3_STUDY_PHS_001436],
        },
      },
      isFetchingAllFenceStudies: false,
    });
  });
});
